import { Component, OnInit, inject, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../shared/services/auth.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private eRef = inject(ElementRef);

  currentUser: any = null;
  notifications: any[] = [];
  unreadCount: number = 0;
  unreadMessagesCount: number = 0;

  isSettingsMenuOpen = false;
  isNotificationOpen = false;
  isDarkMode = false;

  // Biztosítjuk a HTTPS elérést az éles szerveren
  apiUrl = environment.apiUrl.replace('http://', 'https://');
  private refreshInterval: any;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    
    if (!userData) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const tempUser = JSON.parse(userData);
      const userId = tempUser.id || tempUser.user_id;

      if (userId) {
        // ✅ Felhasználói adatok frissítése a szerverről
        this.http.get(`${this.apiUrl}/get_user_details.php?id=${userId}`)
          .subscribe({
            next: (fullUser: any) => {
              // Összepárosítjuk a DB neveket a frontend változókkal
              this.currentUser = {
                ...fullUser,
                // Ha van profilkep_eleres, azt használjuk, különben az alapértelmezettet
                profil_kep: fullUser.profilkep_eleres || 'assets/images/default-avatar.png'
              };

              // Frissítjük a localStorage-ot is a legújabb adatokkal
              localStorage.setItem('user', JSON.stringify(this.currentUser));
              
              // Kezdeti adatok betöltése
              this.loadNotifications();
              this.checkUnreadMessages();
            },
            error: (err) => {
              console.error("Hiba a profil frissítésekor, ideiglenes adatok használata", err);
              this.currentUser = tempUser;
              // Biztonsági mentés a képre hiba esetén is
              this.currentUser.profil_kep = tempUser.profilkep_eleres || 'assets/images/default-avatar.png';
            }
          });
      }
    } catch (e) {
      console.error("Hiba a felhasználói adatok beolvasásakor", e);
      this.router.navigate(['/login']);
    }

    // Polling 10 másodpercenként (üzenetek és értesítések)
    this.refreshInterval = setInterval(() => {
      const currentId = this.currentUser?.id || this.currentUser?.user_id;
      if (currentId) {
        this.checkUnreadMessages();
        this.loadNotifications();
      }
    }, 10000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadNotifications() {
    const userId = this.currentUser?.id || this.currentUser?.user_id;
    if (!userId) return;

    this.http.get<any[]>(`${this.apiUrl}/get_notifications.php?user_id=${userId}`)
      .subscribe({
        next: (data) => {
          this.notifications = Array.isArray(data) ? data : [];
          this.unreadCount = this.notifications.filter(n => n.olvasott == 0).length;
        },
        error: (err) => {
          if (err.status !== 0) console.error("Értesítés hiba:", err);
        }
      });
  }

  handleRequest(kapcsolodoId: number, statusz: string) {
    if (!kapcsolodoId) return;

    const payload = { id: kapcsolodoId, status: statusz };

    this.http.post(`${this.apiUrl}/handle_request.php`, payload).subscribe({
      next: (res: any) => {
        // Sikeres mentés esetén frissítünk
        this.loadNotifications();
      },
      error: (err) => console.error("Hálózati hiba:", err)
    });
  }

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;

    if (this.isNotificationOpen && this.unreadCount > 0) {
      const userId = this.currentUser?.id || this.currentUser?.user_id;
      this.http.get(`${this.apiUrl}/mark_notifications_read.php?user_id=${userId}`)
        .subscribe({
          next: () => {
            this.unreadCount = 0;
            this.notifications.forEach(n => n.olvasott = 1);
          },
          error: (err) => console.error("Hiba az olvasottá tételkor", err)
        });
    }
  }

  // Kijelentkezés és takarítás
  logout() {
    const userId = this.currentUser?.id || this.currentUser?.user_id;
    if (userId) {
      this.http.get(`${this.apiUrl}/logout.php?id=${userId}`).subscribe({ error: () => { } });
    }
    localStorage.removeItem('user');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  checkUnreadMessages() {
    const userId = this.currentUser?.id || this.currentUser?.user_id;
    if (!userId) return;
    this.http.get<any>(`${this.apiUrl}/get_unread_messages_count.php?user_id=${userId}`)
      .subscribe({
        next: (res) => {
          this.unreadMessagesCount = res.unread || 0;
        },
        error: (err) => {
          if (err.status !== 0) console.error("Hiba az üzenetek ellenőrzésekor", err);
        }
      });
  }

  handleBooking(slotId: number, action: string) {
    const userId = this.currentUser?.id || this.currentUser?.user_id;
    if (!userId) return;

    let deleteSlot = false;
    if (action === 'reject') {
      deleteSlot = confirm("Szeretnéd végleg törölni ezt az időpontot a naptáradból is?");
    }

    const payload = { slot_id: slotId, action: action, delete_slot: deleteSlot };

    this.http.post(`${this.apiUrl}/handle_booking.php`, payload)
    .subscribe({
      next: (res: any) => {
        this.loadNotifications();
      },
      error: (err) => console.error(err)
    });
  }

  // Bezárjuk a menüket, ha máshová kattintunk
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isSettingsMenuOpen = false;
      this.isNotificationOpen = false;
    }
  }
}