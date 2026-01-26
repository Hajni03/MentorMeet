import { Component, OnInit, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private eRef = inject(ElementRef);

  currentUser: any = null;
  pendingRequests: any[] = [];
  isSettingsMenuOpen = false;
  isNotificationOpen = false;
  isDarkMode = false;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        // Belépéskor azonnal betöltjük az adatokat
        this.loadNotifications();
      } catch (e) {
        console.error("Hiba a felhasználói adatok beolvasásakor", e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Értesítések betöltése szerepkör szerint
   */
  loadNotifications() {
    if (!this.currentUser?.id) return;

    if (this.currentUser.szerep === 'tanar') {
      // Tanár: get_pending_requests.php használata user_id paraméterrel
      this.http.get<any[]>(`/api/get_pending_requests.php?user_id=${this.currentUser.id}`)
        .subscribe({
          next: (res) => {
            this.pendingRequests = res;
            console.log("Tanár értesítései:", res);
          },
          error: (err) => console.error("Hiba a tanári kérések betöltésekor", err)
        });
    } else {
      // Diák: get_student_notifications.php használata diak_id paraméterrel
      this.http.get<any[]>(`/api/get_student_notifications.php?diak_id=${this.currentUser.id}`)
        .subscribe({
          next: (res) => {
            this.pendingRequests = res;
            console.log("Diák értesítései:", res);
          },
          error: (err) => console.error("Hiba a diák értesítések betöltésekor", err)
        });
    }
  }

  /**
   * Kapcsolati kérés kezelése (Elfogadás/Elutasítás)
   */
  handleRequest(requestId: number, newStatus: string) {
    this.http.post('/api/handle_request.php', { id: requestId, status: newStatus })
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadNotifications(); // Frissítés után újra lekérjük a listát
        },
        error: (err) => console.error("Hiba a kérés kezelésekor", err)
      });
  }

  // --- MENÜ KEZELÉS ---

  toggleNotifications(event: Event) {
    event.stopPropagation(); // Megállítja a buborékolást a HostListener felé
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) {
      this.isSettingsMenuOpen = false; // Csak egy menü lehet nyitva egyszerre
    }
  }

  toggleSettingsMenu(event: Event) {
    event.stopPropagation();
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    if (this.isSettingsMenuOpen) {
      this.isNotificationOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    // Ha a kattintás a komponens (sidebar/header) területén kívül történt, minden menüt bezárunk
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isSettingsMenuOpen = false;
      this.isNotificationOpen = false;
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme');
  }

  goToProfileEdit() {
    this.isSettingsMenuOpen = false;
    if (this.currentUser?.szerep === 'tanar') {
      this.router.navigate(['/teacher-profile-edit']);
    } else {
      this.router.navigate(['/student-profile-edit']);
    }
  }

  logout() {
    if (this.currentUser) {
      this.http.get(`/api/logout.php?id=${this.currentUser.id}`).subscribe();
    }
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
}