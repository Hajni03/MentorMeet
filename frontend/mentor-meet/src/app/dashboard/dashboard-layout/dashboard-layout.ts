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

  // --- DEKLARÁCIÓK (A piros hibák megszüntetése) ---
  currentUser: any = null;
  notifications: any[] = [];      // Eltünteti a pirosat a loadNotifications-nál
  unreadCount: number = 0;
  unreadMessagesCount: number = 0;

  isSettingsMenuOpen = false;
  isNotificationOpen = false;
  isDarkMode = false;

  pendingRequests: any[] = [];
  apiUrl = 'http://localhost:8000/api'; // Fix API elérhetőség

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        if (this.currentUser && this.currentUser.id) {
          // Belépéskor azonnal betöltjük az adatokat
          this.loadNotifications();
          this.checkUnreadMessages();
        }
      } catch (e) {
        console.error("Hiba a felhasználói adatok beolvasásakor", e);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }

    // 10 másodpercenként nézze meg, van-e összesített olvasatlan üzenet
    setInterval(() => {
      if (this.currentUser?.id) {
        this.checkUnreadMessages();
        this.loadNotifications(); // Frissítjük az értesítéseket is
      }
    }, 10000);
  }

  /**
   * Értesítések betöltése
   */
  loadNotifications() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`${this.apiUrl}/get_notifications.php?tanar_id=${this.currentUser.id}`)
      .subscribe({
        next: (data) => {
          this.notifications = data || [];
          // Az adatbázis 'is_read' mezőjét nézzük (0 = olvasatlan)
          this.unreadCount = this.notifications.filter(n => n.olvasott == 0).length;
        },
        error: (err) => console.error("Értesítés hiba:", err)
      });
  }

  /**
   * Kapcsolati kérés kezelése
   */
  handleRequest(requestId: number, newStatus: string) {
    this.http.post(`${this.apiUrl}/handle_request.php`, { id: requestId, status: newStatus })
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadNotifications();
        },
        error: (err) => console.error("Hiba a kérés kezelésekor", err)
      });
  }

  // --- MENÜ KEZELÉS ---

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;

    if (this.isNotificationOpen && this.unreadCount > 0) {
      // Elküldjük a kérést a backendnek, hogy minden értesítés olvasott legyen
      this.http.get(`${this.apiUrl}/mark_notifications_read.php?user_id=${this.currentUser.id}`)
        .subscribe({
          next: () => {
            this.unreadCount = 0;
            // Frissítjük a lokális listát is, hogy vizuálisan ne legyen "unread" stílusú
            this.notifications.forEach(n => n.is_read = 1);
          },
          error: (err) => console.error("Hiba az olvasottá tételkor", err)
        });
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
      this.router.navigate(['/dashboard/teacher-profile-edit']);
    } else {
      this.router.navigate(['/dashboard/student-profile-edit']);
    }
  }

  logout() {
    if (this.currentUser) {
      this.http.get(`${this.apiUrl}/logout.php?id=${this.currentUser.id}`).subscribe();
    }
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  checkUnreadMessages() {
    if (!this.currentUser?.id) return;
    this.http.get<any>(`${this.apiUrl}/get_unread_messages_count.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (res) => {
          this.unreadMessagesCount = res.unread || 0;
        },
        error: (err) => console.error("Hiba az üzenetek ellenőrzésekor", err)
      });
  }
}