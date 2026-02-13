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
  currentUser: any = null;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadFriends();
    }
  }

  loadFriends() {
    this.http.get<any[]>(`/api/get_friends.php?user_id=${this.currentUser.id}`)
      .subscribe(res => this.friends = res);
  }

  // Chat
  openChat(friendId: number) {
    // Átnavigálunk a chat oldalra, és elküldjük az ismerős ID-ját paraméterként
    this.router.navigate(['/chat'], { queryParams: { selected: friendId } });
  }
}
