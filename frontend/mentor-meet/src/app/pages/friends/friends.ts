import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

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

  // Általánosabb név: suggestedUsers (mert lehetnek benne mentorok is)
  friends: any[] = [];             
  suggestedUsers: any[] = [];   
  
  currentUser: any = null;
  showSuggested = false; 
  sentRequests = new Set<number>();
  
  // Docker port beállítása (ha szükséges)
  private apiUrl = 'http://localhost:8000/api'; 

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadConfirmedFriends();
      this.loadSuggestedUsers(); // Meghívjuk az új szűrt listát
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadConfirmedFriends() {
    this.http.get<any[]>(`${this.apiUrl}/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (data) => this.friends = data || [],
        error: (err) => console.error('Hiba az ismerősök betöltésekor:', err)
      });
  }

  /**
   * Ez hívja meg a frissített get_users.php-t, ami szerepkör szerint szűr
   */
  loadSuggestedUsers() {
    const url = `${this.apiUrl}/get_users.php?current_id=${this.currentUser.id}`;
    this.http.get<any[]>(url)
      .subscribe({
        next: (res) => {
          this.suggestedUsers = res || [];
          // Bekapcsoljuk a "Jelölés elküldve" állapotot, ha már van függő kérés
          this.suggestedUsers.forEach(u => {
            if (u.alreadySent) this.sentRequests.add(u.id);
          });
        },
        error: (err) => console.error('Hiba a keresésnél:', err)
      });
  }

  sendRequest(targetId: number) {
    // Okos azonosító kiosztás: ki a tanár és ki a diák?
    const diakId = this.currentUser.szerep === 'diak' ? this.currentUser.id : targetId;
    const tanarId = this.currentUser.szerep === 'tanar' ? this.currentUser.id : targetId;

    const payload = { tanar_id: tanarId, diak_id: diakId };

    this.http.post(`${this.apiUrl}/add_contact.php`, payload)
      .subscribe({
        next: (res: any) => {
          this.sentRequests.add(targetId);
          alert(res.message);
        },
        error: (err) => console.error('Hiba a küldésnél:', err)
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