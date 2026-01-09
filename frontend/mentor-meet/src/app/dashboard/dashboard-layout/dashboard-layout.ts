import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Itt a Router-t is a RouterModule mellé tettem
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent implements OnInit {
  // Injektálás
  private router = inject(Router);
  private http = inject(HttpClient);

  currentUser: any = null;
  pendingRequests: any[] = [];
  isNotificationOpen = false;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        this.loadPendingRequests();
      } catch (e) {
        console.error("Hiba a felhasználói adatok beolvasásakor", e);
        this.router.navigate(['/login']); // Ha rossz az adat a tárolóban, küldjük a loginra
      }
    }
  }

  loadPendingRequests() {
    if (!this.currentUser?.id) return;

    this.http.get(`/api/get_pending_requests.php?user_id=${this.currentUser.id}`).subscribe({
      next: (res: any) => this.pendingRequests = res,
      error: (err) => console.error("Hiba az értesítések betöltésekor", err)
    });
  }

  handleRequest(requestId: number, newStatus: string) {
    this.http.post('/api/handle_request.php', { id: requestId, status: newStatus }).subscribe({
      next: (res: any) => {
        alert(res.message);
        this.loadPendingRequests();
      }
    });
  }

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
  }

  closeNotifications() {
    this.isNotificationOpen = false;
  }

  goToProfileEdit() {
    // A kérdőjel (?.) biztosítja, hogy ha a currentUser null, ne legyen hibaüzenet
    if (this.currentUser?.szerep === 'tanar') {
      this.router.navigate(['/teacher-profile-edit']);
    } else if (this.currentUser?.szerep === 'diak') {
      this.router.navigate(['/student-profile-edit']);
    }
  }
}