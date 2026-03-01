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

  apiUrl = environment.apiUrl.replace('http://', 'https://');
  private refreshInterval: any;

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        if (this.currentUser && this.currentUser.id) {
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

    // Polling beállítása (10 másodpercenként frissít)
    this.refreshInterval = setInterval(() => {
      if (this.currentUser?.id) {
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

  // ✅ VÉGLEGESÍTETT: Már a tiszta tömb válaszra vár a PHP-tól
  loadNotifications() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`${this.apiUrl}/get_notifications.php?user_id=${this.currentUser.id}`)
      .subscribe({
        next: (data) => {
          // Most már a PHP sima tömböt küld: [{}, {}]
          this.notifications = Array.isArray(data) ? data : [];
          this.unreadCount = this.notifications.filter(n => n.olvasott == 0).length;
        },
        error: (err) => {
          if (err.status !== 0) console.error("Értesítés hiba:", err);
        }
      });
  }

 handleRequest(kapcsolodoId: number, statusz: string) {
  if (!kapcsolodoId) {
    console.error("Hiba: Az ID üres!");
    return;
  }

  // Pontosan 'id' és 'status' kulcsokat küldünk
  const payload = { 
    id: kapcsolodoId, 
    status: statusz 
  };

  this.http.post(`${this.apiUrl}/handle_request.php`, payload).subscribe({
    next: (res: any) => {
      if (res.message === "Sikeres mentés!") {
        // Frissítjük a felületet
        const notif = this.notifications.find(n => n.kapcsolodo_id === kapcsolodoId && n.tipus === 'jeloles');
        if (notif) notif.kapcsolat_statusz = statusz;
      } else {
        console.error("Szerver hibaüzenet:", res);
        alert("Szerver hiba: " + res.message);
      }
    },
    error: (err) => console.error("Hálózati hiba:", err)
  });
}

  toggleNotifications(event: Event) {
    event.stopPropagation();
    this.isNotificationOpen = !this.isNotificationOpen;

    if (this.isNotificationOpen && this.unreadCount > 0) {
      this.http.get(`${this.apiUrl}/mark_notifications_read.php?user_id=${this.currentUser.id}`)
        .subscribe({
          next: () => {
            this.unreadCount = 0;
            this.notifications.forEach(n => n.olvasott = 1);
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
      this.http.get(`${this.apiUrl}/logout.php?id=${this.currentUser.id}`).subscribe({
        error: () => { }
      });
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
        error: (err) => {
          if (err.status !== 0) console.error("Hiba az üzenetek ellenőrzésekor", err);
        }
      });
  }

  handleBooking(slotId: number, action: string) {
    if (!this.currentUser?.id) return;

    // Ha elutasítás, megkérdezzük a törlést
    let deleteSlot = false;
    if (action === 'reject') {
      deleteSlot = confirm("Szeretnéd végleg törölni ezt az időpontot a naptáradból is?");
    }

    // ✅ JAVÍTÁS: A kulcsok nevei egyezzenek a PHP-val (slot_id, action)
    const payload = {
      slot_id: slotId,
      action: action,
      delete_slot: deleteSlot
    };

    this.http.post(`${this.apiUrl}/handle_booking.php`, payload)
    .subscribe({
      next: (res: any) => {
        alert(res.message);
        
        // ✅ MEGOLDÁS: Keressük meg az értesítést és írjuk át a státuszát
        const notif = this.notifications.find(n => Number(n.kapcsolodo_id) === Number(slotId) && n.tipus === 'booking');
        if (notif) {
          notif.kapcsolat_statusz = (action === 'confirm') ? 'accepted' : 'rejected';
          notif.olvasott = 1;
        }

        // Biztonság kedvéért a szerverről is frissítünk
        this.loadNotifications();
      },
      error: (err) => console.error(err)
    });
  }

  deleteSlot(slotId: number) {
    this.http.post(`${this.apiUrl}/delete_slot.php`, { slot_id: slotId })
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadNotifications(); // Frissítjük a listát
        },
        error: (err) => console.error("Hiba a törlés során:", err)
      });
  }
}