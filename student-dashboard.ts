import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import huLocale from '@fullcalendar/core/locales/hu';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FullCalendarModule, HttpClientModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss'
})
export class StudentDashboard implements OnInit {
  private http = inject(HttpClient);
  
  user: any = null;
  bookings: any[] = []; 
  loading = true;

  private readonly apiUrl = 'https://mentormeet.hu/backend/api';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: huLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    allDaySlot: false,
    height: 'auto',
    events: [],
    eventClick: (info) => {
      const statusz = info.event.extendedProps['statusz'];
      const statuszSzoveg = statusz === 'accepted' ? 'Visszaigazolva ✅' : 
                           statusz === 'rejected' ? 'Elutasítva ❌' : 'Visszaigazolásra vár ⏳';
      alert(`Tanár: ${info.event.title}\nÁllapot: ${statuszSzoveg}`);
    }
  };

  ngOnInit() {
    // 1. Beolvassuk a localStorage-ból
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const tempUser = JSON.parse(savedUser);
      const userId = tempUser.id || tempUser.user_id;

      // 2. AZONNAL lekérjük a friss adatokat (Név, Szak, stb.)
      this.http.get(`${this.apiUrl}/get_user_details.php?id=${userId}`).subscribe({
        next: (fullUser: any) => {
          this.user = fullUser;
          // Elmentjük a frissített objektumot, hogy a többi komponens is lássa a nevet
          localStorage.setItem('user', JSON.stringify(fullUser));
          this.loadMyCalendar();
        },
        error: (err) => {
          console.error("Hiba a profil frissítésekor", err);
          this.user = tempUser;
          this.loadMyCalendar();
        }
      });
    }
  }

  loadMyCalendar() {
    const userId = this.user?.id || this.user?.user_id;
    if (!userId) {
      this.loading = false;
      return;
    }

    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/get_student_calendar.php?user_id=${userId}`).subscribe({
      next: (res) => {
        this.bookings = res || [];
        const mappedEvents = this.bookings.map(event => ({
          id: event.id || event.foglalas_id,
          title: event.tanar_neve || 'Mentorálás',
          start: event.start || `${event.datum}T${event.kezdes}`,
          end: event.end || `${event.datum}T${event.befejezes}`,
          backgroundColor: event.statusz === 'accepted' ? '#10b981' : 
                           event.statusz === 'rejected' ? '#ef4444' : '#f59e0b',
          borderColor: 'transparent',
          extendedProps: { statusz: event.statusz }
        }));

        setTimeout(() => {
          this.calendarOptions = { ...this.calendarOptions, events: mappedEvents };
          this.loading = false;
        }, 100);
      },
      error: (err) => {
        console.error("Hiba a naptárnál", err);
        this.loading = false;
      }
    });
  }
}