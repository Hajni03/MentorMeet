import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  // Inject-ek
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Adatok
  user: any = null;
  currentUser: any = null;
  subjects: any[] = [];
  loading = true;
  private apiUrl = 'http://localhost:8000/api';

  // Naptár beállítások
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
    events: [],
    eventClick: this.handleDateClick.bind(this), // Fontos a .bind(this)
  };

  ngOnInit() {
    // Bejelentkezett felhasználó lekérése a foglaláshoz
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProfile(id);
    }
  }

  loadProfile(id: string) {
    this.loading = true;
    this.http.get(`${this.apiUrl}/get_user_details.php?id=${id}`)
      .subscribe({
        next: (data: any) => {
          this.user = data;

          if (this.user.szerep === 'tanar') {
            this.loadTeacherSubjects(id);
            this.loadTeacherCalendar(id); // Külön szedtük a naptár töltést
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
    this.http.get<any[]>(`${this.apiUrl}/get_teacher_free_slots.php?teacher_id=${teacherId}`)
      .subscribe({
        next: (res) => {
          console.log('Szerverről érkező időpontok:', res); // Itt ellenőrizheted az F12 konzolon!

          this.calendarOptions = {
            ...this.calendarOptions,
            events: res.map(slot => ({
              id: slot.id,
              title: 'Szabad időpont',
              // A PHP-ból jövő '2026-03-01 10:00:00' formátumot a FullCalendar alapból érti
              start: slot.idopont_start,
              end: slot.idopont_end,
              backgroundColor: '#6a5acd', // A te lila színed
              borderColor: 'transparent',
              extendedProps: {
                datum: slot.datum,
                kezdes: slot.kezdes
              }
            }))
          };
        },
        error: (err) => {
          console.error('Hiba a naptár betöltésekor:', err);
        }
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

  handleDateClick(info: any) {
    if (this.currentUser.szerep !== 'diak') {
      alert('Csak diákok foglalhatnak időpontot!');
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
          // Frissítjük a naptárat, hogy eltűnjön a foglalt időpont
          if (this.user?.id) this.loadTeacherCalendar(this.user.id);
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