import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval, of } from 'rxjs';
import { startWith, switchMap, catchError } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  currentUser: any;
  friends: any[] = [];
  selectedFriend: any = null;
  messages: any[] = [];
  newMessage: string = '';
  selectedFriendId: number | null = null;

  // Fontos: Használj HTTPS-t az environmentben!
  private apiUrl = environment.apiUrl; 
  private messageSub?: Subscription;
  private friendsPollingSub?: Subscription;

  private autoScroll = true;
  lastSeenId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    const userJson = localStorage.getItem('user');
    this.currentUser = userJson ? JSON.parse(userJson) : null;
  }

  ngAfterViewChecked() {
    if (this.autoScroll) {
      this.scrollToBottom();
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['selected']) {
        this.selectedFriendId = Number(params['selected']);
      }
    });
    this.loadFriends();
    this.startFriendsPolling();
  }

  ngOnDestroy() {
    this.stopPolling();
    if (this.friendsPollingSub) {
      this.friendsPollingSub.unsubscribe();
    }
  }

  // --- PARTNER VÁLASZTÁSA ---
  selectFriend(friend: any) {
    if (!friend) return;
    this.selectedFriend = friend;
    this.autoScroll = true;
    this.messages = []; 

    // Azonnali betöltés váltáskor
    this.loadMessages();
    // Polling (frissítés) indítása
    this.startPolling();
  }

  loadFriends() {
    if (!this.currentUser) return;
    this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (res) => {
          this.friends = res;
          if (this.selectedFriendId && this.friends.length > 0) {
            const foundFriend = this.friends.find(f => Number(f.id) === Number(this.selectedFriendId));
            if (foundFriend) this.selectFriend(foundFriend);
          }
        },
        error: (err) => console.error("Barátok betöltése hiba:", err)
      });
  }

  startFriendsPolling() {
    this.friendsPollingSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`).pipe(
          catchError(() => of(this.friends)) // Hiba esetén megtartja a régit
        ))
      )
      .subscribe(res => {
        this.friends = res;
      });
  }

  // --- ÜZENETEK KEZELÉSE ---
  startPolling() {
    this.stopPolling();
    if (!this.selectedFriend) return;

    this.messageSub = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get<any[]>(
          `${this.apiUrl}/get_messages.php?kuldo_id=${this.currentUser.id}&fogado_id=${this.selectedFriend.id}`
        ).pipe(
          catchError(() => of(this.messages))
        ))
      )
      .subscribe(res => {
        this.autoScroll = this.isUserAtBottom();
        this.messages = res;
      });
  }

  stopPolling() {
    if (this.messageSub) {
      this.messageSub.unsubscribe();
      this.messageSub = undefined;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedFriend) return;

    const body = {
      kuldo_id: this.currentUser.id,
      fogado_id: this.selectedFriend.id,
      szoveg: this.newMessage 
    };

    this.autoScroll = true; 
    this.http.post(`${this.apiUrl}/send_messages.php`, body)
      .subscribe({
        next: () => {
          this.newMessage = '';
          this.loadMessages(); 
        },
        error: (err) => console.error("Küldési hiba:", err)
      });
  }

  loadMessages() {
    if (!this.selectedFriend || !this.currentUser) return;
    this.http.get<any[]>(
      `${this.apiUrl}/get_messages.php?kuldo_id=${this.currentUser.id}&fogado_id=${this.selectedFriend.id}`
    ).subscribe(msgs => {
      // Olvasottság jelzés kiszámítása az elválasztóhoz
      const lastRead = [...msgs].reverse().find(m => 
        Number(m.fogado_id) === Number(this.currentUser.id) && m.olvasott == 1
      );
      this.lastSeenId = lastRead ? lastRead.id : 0;
      
      this.messages = msgs;
      this.autoScroll = true;
    });
  }

  // --- GÖRGETÉSI LOGIKA ---
  private scrollToBottom(): void {
    if (!this.scrollContainer) return;
    try {
      const element = this.scrollContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    } catch (err) { }
  }

  private isUserAtBottom(): boolean {
    if (!this.scrollContainer) return true;
    const element = this.scrollContainer.nativeElement;
    const threshold = 150; 
    const position = element.scrollTop + element.clientHeight;
    const max = element.scrollHeight;
    return max - position < threshold;
  }

  // --- SEGÉDFÜGGVÉNYEK ---

  isNewDay(index: number): boolean {
    if (index === 0) return true;
    const prev = new Date(this.messages[index - 1].datum);
    const curr = new Date(this.messages[index].datum);
    return prev.toDateString() !== curr.toDateString() || 
           (curr.getTime() - prev.getTime()) > 30 * 60 * 1000;
  }

  shouldShowUnreadDivider(msg: any, index: number): boolean {
    if (msg.kuldo_id !== this.currentUser.id && msg.id > this.lastSeenId) {
        if (index === 0 || this.messages[index - 1].id <= this.lastSeenId) {
            return true;
        }
    }
    return false;
  }

  // Időformázó függvény a build hibák elkerülésére
  formatLastActive(minutes: any): string {
    if (minutes === null || minutes === undefined || minutes === '') {
      return 'régen';
    }
    const mins = Number(minutes);
    if (isNaN(mins)) return 'régen';

    if (mins < 1) return 'épp most';
    if (mins < 60) return `${mins}p perce`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}ó órája`;
    
    const days = Math.floor(hours / 24);
    return `${days}n napja`;
  }
}