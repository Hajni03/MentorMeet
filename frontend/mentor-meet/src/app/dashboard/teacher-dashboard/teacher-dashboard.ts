import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  // Felhasználói adatok
  currentUser: any = null;
  // ✅ JAVÍTVA: Éles HTTPS útvonal
  private readonly apiUrl = 'https://mentormeet.hu/backend/api';

  // Naptár vezérlés
  view: 'month' | 'week' | 'day' = 'month';
  currentDate: Date = new Date();
  isAddPanelOpen: boolean = false;

  // Adatok
  idopontok: any[] = [];
  calendarDays: any[] = []; // A rácsos naptárhoz (42 napos nézet)
  hetiNapok = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];
  mySubjects: any[] = [];

  // Új időpont modell
  ujIdopont = {
    cim: '',
    datum: '',
    kezdes: '',
    befejezes: '',
    tantargy_id: ''
  };

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      this.currentUser = parsedUser;
      
      // ✅ JAVÍTVA: get_user_details.php hívás az éles URL-el
      this.http.get<any>(`${this.apiUrl}/get_user_details.php?id=${this.currentUser.id}`).subscribe({
        next: (fullUser) => {
          this.currentUser = fullUser;
          localStorage.setItem('user', JSON.stringify(fullUser));
          
          // Csak miután megjöttek a user adatok, töltsük be a többit
          this.loadSchedule();
          this.loadMySubjects();
        },
        error: (err) => {
          console.error("Hiba a felhasználói adatok frissítésekor", err);
          // Hiba esetén is próbáljuk meg betölteni a naptárat a meglévő ID-val
          this.loadSchedule();
          this.loadMySubjects();
        }
      });
    }
  }

  // --- NAPTÁR GENERÁLÁS ÉS NAVIGÁCIÓ ---

  loadSchedule() {
    if (!this.currentUser?.id) return;

    // ✅ JAVÍTVA: API URL használata
    this.http.get<any[]>(`${this.apiUrl}/get_schedule.php?tanar_id=${this.currentUser.id}`).subscribe({
      next: (data) => {
        this.idopontok = data || [];
        this.generateCalendar();
      },
      error: (err) => console.error("Hiba az órarend betöltésekor", err)
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.calendarDays = [];

    // Létrehozunk egy másolatot a currentDate-ről, hogy ne módosítsuk az eredetit
    let startDay = new Date(year, month, 1);
    let daysToGenerate = 42; 

    if (this.view === 'month') {
      const dayOfWeek = startDay.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDay.setDate(startDay.getDate() + diff);
      daysToGenerate = 42;
    }
    else if (this.view === 'week') {
      startDay = new Date(this.currentDate);
      const dayOfWeek = startDay.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDay.setDate(startDay.getDate() + diff);
      daysToGenerate = 7;
    }
    else if (this.view === 'day') {
      startDay = new Date(this.currentDate);
      daysToGenerate = 1;
    }

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      const dateString = this.formatDate(date);

      const dailySlots = this.idopontok.filter(s => s.datum === dateString).map(s => ({
        ...s,
        isFree: !s.diak_id,
        startShort: s.kezdes ? s.kezdes.substring(0, 5) : '',
        endShort: s.befejezes ? s.befejezes.substring(0, 5) : ''
      }));

      this.calendarDays.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: this.formatDate(date) === this.formatDate(new Date()),
        slots: dailySlots
      });
    }
  }

  changeView(newView: 'month' | 'week' | 'day') {
    this.view = newView;
    this.generateCalendar();
  }

  next() {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    } else if (this.view === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() + 7);
    } else if (this.view === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() + 1);
    }
    this.generateCalendar();
  }

  prev() {
    if (this.view === 'month') {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    } else if (this.view === 'week') {
      this.currentDate.setDate(this.currentDate.getDate() - 7);
    } else if (this.view === 'day') {
      this.currentDate.setDate(this.currentDate.getDate() - 1);
    }
    this.generateCalendar();
  }

  toggleAddPanel() {
    this.isAddPanelOpen = !this.isAddPanelOpen;
  }

  loadMySubjects() {
    if (!this.currentUser?.id) return;
    // ✅ JAVÍTVA: API URL használata
    this.http.get<any[]>(`${this.apiUrl}/get_tanar_tantargyak.php?tanar_id=${this.currentUser.id}`).subscribe({
      next: (data) => this.mySubjects = data || [],
      error: (err) => console.error("Hiba a tantárgyak betöltésekor", err)
    });
  }

  addIdopont() {
    if (!this.ujIdopont.datum || !this.ujIdopont.kezdes || !this.ujIdopont.befejezes) {
      alert("Kérlek tölts ki minden időpont mezőt!");
      return;
    }

    const payload = {
      tanar_id: this.currentUser.id,
      cim: this.ujIdopont.cim,
      datum: this.ujIdopont.datum,
      kezdes: this.ujIdopont.kezdes,
      befejezes: this.ujIdopont.befejezes,
      tantargy_id: this.ujIdopont.tantargy_id || null
    };

    // ✅ JAVÍTVA: API URL használata
    this.http.post(`${this.apiUrl}/add_idopont.php`, payload).subscribe({
      next: () => {
        alert("Időpont sikeresen rögzítve!");
        this.loadSchedule();
        this.ujIdopont = { cim: '', datum: '', kezdes: '', befejezes: '', tantargy_id: '' };
        this.isAddPanelOpen = false;
      },
      error: (err) => alert("Hiba a mentés során!")
    });
  }

  get upcomingMeetings() {
    const meetings: any[] = [];
    // Mivel a calendarDays csak a nézetet tartalmazza, jobb az idopontokból számolni
    this.idopontok.forEach(slot => {
        if (slot.diak_id) {
          meetings.push({
            date: new Date(slot.datum),
            cim: slot.cim,
            kezdes: slot.kezdes,
            befejezes: slot.befejezes
          });
        }
    });
    return meetings.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  }

  get userInitials(): string {
    if (!this.currentUser?.nev) return '??';
    return this.currentUser.nev
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  get currentMonthName(): string {
    return this.currentDate.toLocaleDateString('hu-HU', { month: 'long' });
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}