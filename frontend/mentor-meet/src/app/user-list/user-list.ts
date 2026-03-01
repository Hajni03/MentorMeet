import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/services/auth.service';
import { DashboardLayoutComponent } from '../dashboard/dashboard-layout/dashboard-layout';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../environments/environments';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, DashboardLayoutComponent, RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  users: any[] = [];
  pendingRequests: any[] = [];
  currentUser: any = null;

  // ✅ JAVÍTÁS: Kényszerített HTTPS az éles szerverhez
  private apiUrl = environment.apiUrl.replace('http://', 'https://');

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.loadUsers();
        this.loadPendingRequests();
      } catch (e) {
        console.error("Hiba a felhasználói adatok beolvasásakor", e);
      }
    }
  }

  loadUsers(searchTerm: string = '') {
    if (!this.currentUser?.id) return;

    // ✅ JAVÍTÁS: Biztonságos HTTPS URL használata
    const url = `${this.apiUrl}/get_users.php?current_id=${this.currentUser.id}&search=${searchTerm}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // Ellenőrizzük, hogy a válasz tömb-e
        const results = Array.isArray(data) ? data : [];
        this.users = results.map((u: any) => ({ ...u, alreadySent: false }));
        console.log('Találatok betöltve:', this.users.length);
      },
      error: (err) => {
        if (err.status !== 0) console.error("Hiba a betöltésnél", err);
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.loadUsers(searchTerm);
  }

  onAddContact(targetId: number) {
  const body = {
    sender_id: this.currentUser.id,
    receiver_id: targetId,
    diak_id: this.currentUser.szerep === 'diak' ? this.currentUser.id : targetId,
    tanar_id: this.currentUser.szerep === 'tanar' ? this.currentUser.id : targetId
  };

  this.http.post(`${this.apiUrl}/add_contact.php`, body).subscribe({
    next: (res: any) => {
      alert(res.message);
      // ✅ Frissítsük a lokális listát, hogy eltűnjön a gomb vagy megváltozzon a felirat
      const user = this.users.find(u => u.id === targetId);
      if (user) {
        user.alreadySent = true; 
      }
    },
    error: (err) => {
      console.error(err);
      alert(err.error?.message || 'Hiba történt a jelölés során.');
    }
  });
}
  loadPendingRequests() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`${this.apiUrl}/get_pending_requests.php?user_id=${this.currentUser.id}`).subscribe({
      next: (res) => {
        this.pendingRequests = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        if (err.status !== 0) console.error("Hiba a kérések betöltésekor", err);
      }
    });
  }

  handleRequest(requestId: number, newStatus: string) {
    this.http.post(`${this.apiUrl}/handle_request.php`, { id: requestId, status: newStatus }).subscribe({
      next: (res: any) => {
        alert(res.message || 'Művelet sikeres!');
        this.loadPendingRequests();
        // Opcionálisan frissíthetjük a felhasználói listát is
        this.loadUsers();
      },
      error: (err) => alert('Hiba a kérés feldolgozásakor')
    });
  }
}