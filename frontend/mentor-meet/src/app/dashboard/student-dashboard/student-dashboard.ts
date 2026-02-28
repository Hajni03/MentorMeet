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
  bookings: any[] = []; // A lista nézethez, amit a HTML-ben használtunk
  loading = true;

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
    events: []
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
    
    // API hívás a diák naptáráért
    const url = `http://localhost:8000/api/get_student_calendar.php?user_id=${this.user.id}`;
    
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        // 1. Elmentjük a nyers adatokat a lista nézethez is
        this.bookings = res;

        // 2. Frissítjük a naptár eseményeket (referencia csere!)
        this.calendarOptions = {
          ...this.calendarOptions,
          events: res.map(event => ({
            title: `${event.targy} - ${event.tanar_neve}`,
            start: event.idopont_start,
            end: event.idopont_end,
            // Színkódok a HTML legend-hez igazítva
            backgroundColor: event.statusz === 'accepted' ? '#4CAF50' : '#FFC107',
            borderColor: 'transparent',
            extendedProps: {
              statusz: event.statusz
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