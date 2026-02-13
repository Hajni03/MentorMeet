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

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
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
    // --- EZT ÁLLÍTJUK BE A DIÁKNAK ---
    editable: false,   // Nem mozgathatja az órákat
    selectable: false, // Nem hozhat létre új időpontot
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
    
    // A diák saját foglalásait kérjük le
    this.http.get<any[]>(`http://localhost:8000/api/get_student_calendar.php?user_id=${this.user.id}`)
      .subscribe(res => {
        this.calendarOptions.events = res.map(event => ({
          title: `${event.targy} - ${event.tanar_neve}`,
          start: event.idopont_start,
          end: event.idopont_end,
          backgroundColor: event.statusz === 'visszaigazolt' ? '#4B3B73' : '#848CAF',
          borderColor: 'transparent'
        }));
      });
  }
}