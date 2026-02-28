import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { DashboardLayoutComponent } from '../dashboard/dashboard-layout/dashboard-layout';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // 1. Lépés: Importáld a RouterModule-t!

@Component({
  selector: 'app-user-list',
  standalone: true,
  // 2. Lépés: Add hozzá az imports tömbhöz!
  imports: [CommonModule, DashboardLayoutComponent, RouterModule], 
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  users: any[] = [];
  pendingRequests: any[] = [];
  currentUser: any;
  private apiUrl = 'http://localhost:8000/backend/api'; // Érdemes fix alap URL-t használni

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.loadUsers();
    this.loadPendingRequests();
  }

  loadUsers(searchTerm: string = '') {
    // Használjuk a teljes URL-t a biztonság kedvéért
    const url = `${this.apiUrl}/get_users.php?current_id=${this.currentUser.id}&search=${searchTerm}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.users = data.map((u: any) => ({ ...u, alreadySent: false }));
        console.log('Találatok:', this.users);
      },
      error: (err) => console.error("Hiba a betöltésnél", err)
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.loadUsers(searchTerm);
  }

  onAddContact(targetId: number) {
    // Logika változatlan, az authService intézi a mentést
    const diakId = this.currentUser.szerep === 'diak' ? this.currentUser.id : targetId;
    const tanarId = this.currentUser.szerep === 'tanar' ? this.currentUser.id : targetId;

    this.authService.addContact(diakId, tanarId).subscribe({
      next: (res) => {
        alert(res.message);
        const user = this.users.find(u => u.id === targetId);
        if (user) {
          user.alreadySent = true;
        }
      },
      error: (err) => alert(err.error?.message || 'Hiba történt')
    });
  }

  loadPendingRequests() {
    this.http.get(`${this.apiUrl}/get_pending_requests.php?user_id=${this.currentUser.id}`).subscribe({
      next: (res: any) => {
        this.pendingRequests = res;
      },
      error: (err) => console.error("Hiba a kérések betöltésekor", err)
    });
  }

  handleRequest(requestId: number, newStatus: string) {
    this.http.post(`${this.apiUrl}/handle_request.php`, { id: requestId, status: newStatus }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.loadPendingRequests();
      },
      error: (err) => alert('Hiba a kérés feldolgozásakor')
    });
  }
}