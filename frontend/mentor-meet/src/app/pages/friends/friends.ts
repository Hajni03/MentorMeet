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

  // A HTML ezeket a változókat várja
  friends: any[] = [];             // Visszaigazolt ismerősök (Ismerősök fül)
  suggestedStudents: any[] = [];   // Iskolatársak (Keresés fül)
  
  currentUser: any = null;
  showSuggested = false; 
  sentRequests = new Set<number>();

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      
      // Mindkét listát betöltjük induláskor
      this.loadConfirmedFriends();
      this.loadSchoolStudents();
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Visszaigazolt ismerősök lekérése (accepted státusz)
   */
  loadConfirmedFriends() {
    this.http.get<any[]>(`/api/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (data) => {
          this.friends = data || [];
          console.log('Visszaigazolt ismerősök:', this.friends);
        },
        error: (err) => console.error('Hiba az ismerősök betöltésekor:', err)
      });
  }

  /**
   * Potenciális jelöltek (diákok) lekérése az iskolából
   */
  loadSchoolStudents() {
    const url = `/api/get_school_students.php?user_id=${this.currentUser.id}&iskola_id=${this.currentUser.iskola_id}`;
    this.http.get<any[]>(url)
      .subscribe({
        next: (res) => {
          this.suggestedStudents = res || [];
          // Ha a PHP küld is_pending jelzést, töltsük fel a Set-et, hogy a gomb disabled legyen
          this.suggestedStudents.forEach(s => {
            if (s.is_pending) this.sentRequests.add(s.id);
          });
        },
        error: (err) => console.error('Hiba a diákok betöltésekor:', err)
      });
  }

  /**
   * Jelölés elküldése
   */
  sendRequest(targetId: number) {
    const payload = {
      tanar_id: this.currentUser.id,
      diak_id: targetId
    };

    this.http.post('/api/add_contact.php', payload)
      .subscribe({
        next: (res: any) => {
          if (res.message.includes('sikeresen') || res.message.includes('Már küldtél')) {
            this.sentRequests.add(targetId);
          }
        },
        error: (err) => console.error('Hiba a küldésnél:', err)
      });
  }

  openChat(friendId: number) {
    this.router.navigate(['/chat'], { queryParams: { selected: friendId } });
  }
}