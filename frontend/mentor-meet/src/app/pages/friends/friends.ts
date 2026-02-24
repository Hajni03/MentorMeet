import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router'; // <--- Kell a RouterModule!

@Component({
  selector: 'app-friends',
  standalone: true, // Ha standalone komponenst használsz
  imports: [CommonModule, RouterModule], // <--- Tedd be ide a RouterModule-t!
  templateUrl: './friends.html',
  styleUrl: './friends.scss',
})
export class Friends implements OnInit { // Érdemes az implemenst odaírni
  constructor(private router: Router) { }

  private http = inject(HttpClient);
  friends: any[] = [];
  suggestedStudents: any[] = []; // <--- Ezt használjuk a HTML-ben is!
  currentUser: any = null;
  showSuggested = false; // <--- Ez valószínűleg hiányzott, a HTML-ben viszont használod a kapcsolót!

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadFriends();
      this.loadSchoolStudents();
    }
  }

  loadFriends() {
    this.http.get<any[]>(`http://localhost:8000/api/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe(res => this.friends = res);
  }

  loadSchoolStudents() {
    this.http.get<any[]>(`http://localhost:8000/api/get_school_students.php?user_id=${this.currentUser.id}&iskola_id=${this.currentUser.iskola_id}`)
      .subscribe(res => {
        this.suggestedStudents = res;
        console.log('Ajánlott diákok:', res); // Így látod a konzolon, ha megjönnek az adatok
      });
  }

  openChat(friendId: number) {
    this.router.navigate(['/chat'], { queryParams: { selected: friendId } });
  }

  // Ezt hívja meg a jelölés gomb
  sendRequest(targetId: number) {
    console.log('Jelölés küldése:', targetId);
    // Ide jön majd az add_friend.php hívása
  }
}