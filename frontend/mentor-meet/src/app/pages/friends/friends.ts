import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-friends',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './friends.html',
  styleUrl: './friends.scss',
})
export class Friends implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  friends: any[] = [];             
  suggestedUsers: any[] = [];   
  
  currentUser: any = null;
  showSuggested = false; 
  sentRequests = new Set<number>();
  
  private apiUrl = environment.apiUrl.replace('http://', 'https://'); 

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.loadConfirmedFriends();
        this.loadSuggestedUsers(); 
      } catch (e) {
        console.error("Hibás felhasználói adatok", e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadConfirmedFriends() {
    if (!this.currentUser?.id) return;
    
    this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (data) => this.friends = data || [],
        error: (err) => {
           if (err.status !== 0) console.error('Hiba az ismerősök betöltésekor:', err);
        }
      });
  }

  loadSuggestedUsers() {
    if (!this.currentUser?.id) return;

    const url = `${this.apiUrl}/get_users.php?current_id=${this.currentUser.id}`;
    this.http.get<any[]>(url)
      .subscribe({
        next: (res) => {
          this.suggestedUsers = res || [];
          this.sentRequests.clear();
          this.suggestedUsers.forEach(u => {
            if (u.alreadySent) this.sentRequests.add(u.id);
          });
        },
        error: (err) => {
           if (err.status !== 0) console.error('Hiba a keresésnél:', err);
        }
      });
  }

  sendRequest(targetId: number) {
    if (!this.currentUser?.id) return;

    // ✅ JAVÍTÁS: Összehangolva az add_contact.php elvárásaival
    const payload = { 
      sender_id: this.currentUser.id,
      receiver_id: targetId,
      diak_id: this.currentUser.szerep === 'diak' ? this.currentUser.id : targetId,
      tanar_id: this.currentUser.szerep === 'tanar' ? this.currentUser.id : targetId 
    };

    this.http.post(`${this.apiUrl}/add_contact.php`, payload)
      .subscribe({
        next: (res: any) => {
          this.sentRequests.add(targetId);
          alert(res.message || 'Kapcsolatfelvételi kérelem elküldve!');
        },
        error: (err) => {
          console.error('Hiba a küldésnél:', err);
          alert(err.error?.message || 'Hiba történt a küldés során.');
        }
      });
  }

  toggleSuggested() {
    this.showSuggested = !this.showSuggested;
    if (this.showSuggested) {
      this.loadSuggestedUsers();
    }
  }

  openChat(friendId: number) {
    this.router.navigate(['/chat'], { queryParams: { selected: friendId } });
  }
}