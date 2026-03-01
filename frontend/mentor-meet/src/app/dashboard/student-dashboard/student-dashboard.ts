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

  // ✅ JAVÍTVA: Éles HTTPS útvonal a mentormeet.hu-hoz
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
    editable: false,
    selectable: false,
    events: [],
    eventClick: (info) => {
      const statusz = info.event.extendedProps['statusz'];
      const statuszSzoveg = statusz === 'accepted' ? 'Visszaigazolva ✅' : 
                           statusz === 'rejected' ? 'Elutasítva ❌' : 'Visszaigazolásra vár ⏳';
      
      alert(`Tanár: ${info.event.title}\nÁllapot: ${statuszSzoveg}`);
    }
  };

  ngOnInit() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
      this.loadMyCalendar();
    }
  }

  loadMyCalendar() {
    if (!this.user?.id) return;
    this.loading = true;
    
    // ✅ JAVÍTVA: apiUrl használata és HTTPS kérés
    const url = `${this.apiUrl}/get_student_calendar.php?user_id=${this.user.id}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        console.log("Szerver válasza:", res);
        this.bookings = res || [];

        // ✅ JAVÍTVA: FullCalendar események mapping-je
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.bookings.map(event => ({
            // Kezeljük mindkét lehetséges mezőnevet, amit a PHP küldhet
            id: event.id || event.foglalas_id,
            title: event.tanar_neve || 'Mentorálás',
            start: event.start || event.idopont_start,
            end: event.end || event.idopont_end,
            
            // SZÍNEZÉS:
            backgroundColor: event.statusz === 'accepted' ? '#10b981' : 
                             event.statusz === 'rejected' ? '#ef4444' : '#f59e0b',
            borderColor: 'transparent',
            
            extendedProps: {
              statusz: event.statusz,
              megjegyzes: event.megjegyzes
            }
          }))
        };
        this.loading = false;
      },
      error: (err) => {
        console.error("Hiba a naptár betöltésekor:", err);
        this.loading = false;
      }
    });
  }
}