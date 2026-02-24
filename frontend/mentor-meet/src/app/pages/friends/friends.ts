import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friends',
  imports: [CommonModule],
  templateUrl: './friends.html',
  styleUrl: './friends.scss',
})
export class Friends {
  constructor(private router: Router) { }

  private http = inject(HttpClient);
  friends: any[] = [];
  suggestedStudents: any[] = [];
  currentUser: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadFriends();
      this.loadSchoolStudents();
    }
  }

  loadFriends() {
    this.http.get<any[]>(`/api/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe(res => this.friends = res);
  }
  loadSchoolStudents() {
    // Itt küldjük el az iskola_id-t is, amit a bejelentkezéskor mentettünk el
    this.http.get<any[]>(`/api/get_school_students.php?user_id=${this.currentUser.id}&iskola_id=${this.currentUser.iskola_id}`)
      .subscribe(res => this.suggestedStudents = res);
  }

  // Chat
  openChat(friendId: number) {
    // Átnavigálunk a chat oldalra, és elküldjük az ismerős ID-ját paraméterként
    this.router.navigate(['/chat'], { queryParams: { selected: friendId } });
  }
}
