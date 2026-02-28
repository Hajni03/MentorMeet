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
  private apiUrl = 'http://localhost:8000/api';

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
      alert(`Tanár: ${info.event.title}\nÁllapot: ${info.event.extendedProps['statusz'] === 'accepted' ? 'Visszaigazolva' : 'Visszaigazolásra vár'}`);
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
    
    // JAVÍTÁS 1: A PHP 'user_id' néven várja a paramétert a legutóbbi kódod alapján!
    const url = `${this.apiUrl}/get_student_calendar.php?user_id=${this.user.id}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        console.log("Szerver válasza:", res); // Ellenőrizd a konzolon, hogy jön-e adat!
        this.bookings = res;

        this.calendarOptions = {
          ...this.calendarOptions,
          events: res.map(event => ({
            id: event.id || event.foglalas_id,
            title: event.tanar_neve,
            // JAVÍTÁS 2: A legutóbbi PHP 'start' és 'end' néven küldi a formázott dátumot
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