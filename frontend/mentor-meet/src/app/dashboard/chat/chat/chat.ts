import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  private apiUrl = 'http://localhost:8000/api';
  private messageSub?: Subscription;
  private friendsPollingSub?: Subscription;

  // Változó a görgetés vezérléséhez
  private autoScroll = true;

  lastSeenId: number = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute) {
    const userJson = localStorage.getItem('user');
    this.currentUser = userJson ? JSON.parse(userJson) : null;
  }

  // JAVÍTÁS: Csak akkor görgetünk, ha az autoScroll engedélyezve van
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

  // Barát választása
  selectFriend(friend: any) {
    this.selectedFriend = friend;
    this.autoScroll = true;

    // 1. Először lekérjük az utolsó üzenetet, amit MÁR OLVASTUNK
    // Ezt azért tesszük, hogy tudjuk, honnan kezdődik az "ÚJ" rész a megnyitás pillanatában
    this.http.get<any[]>(`${this.apiUrl}/get_messages.php?kuldo_id=${this.currentUser.id}&fogado_id=${friend.id}`)
      .subscribe({
        next: (msgs) => {
          // Megkeressük az utolsó olyan üzenet ID-ját, ami már olvasott volt
          const lastRead = [...msgs].reverse().find(m => m.fogado_id === this.currentUser.id && m.olvasott == 1);
          this.lastSeenId = lastRead ? lastRead.id : 0;

          this.messages = msgs;
          this.updateSidebarDot();
          this.startPolling();
        }
      });
  }

  loadFriends() {
    if (!this.currentUser) return;
    this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (res) => {
          this.friends = res;
          if (this.selectedFriendId && this.friends.length > 0) {
            const foundFriend = this.friends.find(f => f.id == this.selectedFriendId);
            if (foundFriend) this.selectFriend(foundFriend);
          }
        }
      });
  }

  // Polling a barát listához (piros pöttyökhöz)
  startFriendsPolling() {
    this.friendsPollingSub = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`))
      )
      .subscribe(res => {
        this.friends = res;
        this.updateSidebarDot();
      });
  }

  // Üzenetek folyamatos frissítése
  startPolling() {
    this.stopPolling();
    if (!this.selectedFriend) return;

    this.messageSub = interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.http.get<any[]>(
          `${this.apiUrl}/get_messages.php?kuldo_id=${this.currentUser.id}&fogado_id=${this.selectedFriend.id}`
        ))
      )
      .subscribe(res => {
        // JAVÍTÁS: Megnézzük, hogy a felhasználó az alján van-e, mielőtt frissítünk
        this.autoScroll = this.isUserAtBottom();
        this.messages = res;
      });
  }

  stopPolling() {
    if (this.messageSub) this.messageSub.unsubscribe();
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedFriend) return;

    const body = {
      kuldo_id: this.currentUser.id,
      fogado_id: this.selectedFriend.id,
      szoveg: this.newMessage
    };

    this.autoScroll = true; // Saját üzenetnél mindig görgessen le
    this.http.post(`${this.apiUrl}/send_messages.php`, body)
      .subscribe(() => {
        this.newMessage = '';
        this.loadMessages();
      });
  }

  loadMessages() {
    if (!this.selectedFriend) return;
    this.http.get<any[]>(
      `${this.apiUrl}/get_messages.php?kuldo_id=${this.currentUser.id}&fogado_id=${this.selectedFriend.id}`
    ).subscribe(res => {
      this.messages = res;
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

  // Megnézi, hogy a felhasználó épp az alján tartózkodik-e (threshold = 100px)
  private isUserAtBottom(): boolean {
    if (!this.scrollContainer) return true;
    const element = this.scrollContainer.nativeElement;
    const threshold = 100;
    const position = element.scrollTop + element.clientHeight;
    const max = element.scrollHeight;
    return max - position < threshold;
  }

  // --- MESSENGER STÍLUS SEGÉDFÜGGVÉNYEK ---

  isLastSentMessage(msg: any, index: number): boolean {
    return msg.kuldo_id === this.currentUser.id && index === this.messages.length - 1;
  }

  isNewDay(prevDate: string, currDate: string): boolean {
    if (!prevDate) return true;
    const prev = new Date(prevDate);
    const curr = new Date(currDate);
    // Új nap VAGY több mint 30 perc telt el
    return prev.toDateString() !== curr.toDateString() ||
      (curr.getTime() - prev.getTime()) > 10 * 60 * 1000;
  }

  shouldShowUnreadDivider(msg: any, index: number): boolean {
   // Ha az üzenet a partnertől jött ÉS az ID-ja nagyobb, mint amit utoljára olvasottként láttunk
    if (msg.kuldo_id !== this.currentUser.id && msg.id > this.lastSeenId) {
        // Csak az első ilyen üzenet fölé tegyük (vagyis az előző még a lastSeenId alatt volt)
        if (index === 0 || this.messages[index - 1].id <= this.lastSeenId) {
            return true;
        }
    }
    return false;
  }

  updateSidebarDot() {
    this.http.get<any>(`${this.apiUrl}/get_unread_count.php?user_id=${this.currentUser.id}`).subscribe();
  }

  onTyping() {
    if (!this.selectedFriend) return;
    this.http.post(`${this.apiUrl}/typing_status.php`, {
      user_id: this.currentUser.id,
      target_id: this.selectedFriend.id
    }).subscribe();
  }
}