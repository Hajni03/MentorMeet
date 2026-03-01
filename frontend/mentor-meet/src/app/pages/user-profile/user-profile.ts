import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environments'; // ✅ Importáld az environmentet!

// FullCalendar importok
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import huLocale from '@fullcalendar/core/locales/hu';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user: any = null;
  currentUser: any = null;
  subjects: any[] = [];
  loading = true;

  // ✅ JAVÍTÁS: Éles API URL használata localhost helyett
  private apiUrl = environment.apiUrl.replace('http://', 'https://');

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: huLocale,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    allDaySlot: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    // ✅ JAVÍTÁS: Eseménykezelő bekötése
    eventClick: (info) => this.handleEventClick(info)
  };

  ngOnInit() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error("Hiba a user parse során", e);
      }
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfile(id);
    }
  }

  loadProfile(id: string) {
    this.loading = true;
    // ✅ get_user_details.php hívása
    this.http.get(`${this.apiUrl}/get_user_details.php?id=${id}`)
      .subscribe({
        next: (data: any) => {
          this.user = data;
          if (this.user.szerep === 'tanar') {
            this.loadTeacherSubjects(id);
            this.loadTeacherCalendar(id);
          } else {
            this.loading = false;
          }
        },
        error: (err) => {
          console.error('Hiba a profil betöltésekor', err);
          this.loading = false;
        }
      });
  }

 loadTeacherCalendar(teacherId: string) {
  // ✅ Átváltunk a get_schedule.php-ra, hogy lássuk a foglalt (piros) időpontokat is
  this.http.get<any[]>(`${this.apiUrl}/get_schedule.php?tanar_id=${teacherId}`)
    .subscribe({
      next: (res) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: res.map(slot => ({
            id: slot.id,
            title: slot.diak_id ? 'Foglalt' : 'Szabad',
            start: slot.idopont_start,
            end: slot.idopont_end,
            // ✅ A PHP-ból érkező status_color-t használjuk
            backgroundColor: slot.status_color, 
            borderColor: 'transparent',
            // Megakadályozzuk, hogy a foglalt időpontra lehessen kattintani
            display: slot.aktiv == 0 ? 'none' : 'auto', 
            extendedProps: {
              isBooked: !!slot.diak_id
            }
          }))
        };
      },
      error: (err) => console.error('Hiba a naptár betöltésekor:', err)
    });
}

  loadTeacherSubjects(tanarId: string) {
    this.http.get<any[]>(`${this.apiUrl}/get_tanar_tantargyak.php?tanar_id=${tanarId}`)
      .subscribe({
        next: (data) => {
          this.subjects = data || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Hiba a tantárgyak betöltésekor', err);
          this.loading = false;
        }
      });
  }

  // ✅ JAVÍTÁS: Eseménykezelő függvény neve és logikája
  handleEventClick(info: any) {
  // ✅ ÚJ: Ellenőrizzük, hogy az időpont már foglalt-e
  if (info.event.extendedProps['isBooked']) {
    alert('Ez az időpont már foglalt!');
    return;
  }

  if (!this.currentUser) {
    alert('A foglaláshoz be kell jelentkezned!');
    return;
  }
    const slotId = info.event.id;
    const startStr = info.event.start.toLocaleString('hu-HU', {
      month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    if (confirm(`Szeretnéd lefoglalni ezt az időpontot: ${startStr}?`)) {
      this.bookSession(slotId);
    }
  }

  bookSession(slotId: string) {
    const payload = {
      slot_id: slotId,
      student_id: this.currentUser.id
    };

    this.http.post(`${this.apiUrl}/book_session.php`, payload)
      .subscribe({
        next: (res: any) => {
          alert(res.message || 'Sikeres foglalás! Várj a tanár visszaigazolására.');
          if (this.user?.id) this.loadTeacherCalendar(this.user.id.toString());
        },
        error: (err) => alert(err.error?.message || 'Hiba történt a foglalás során.')
      });
  }

  goBack() {
    window.history.back();
  }

  goToChat(userId: number) {
    if (!userId) return;
    this.router.navigate(['/chat'], {
      queryParams: { selected: userId }
    });
  }
}