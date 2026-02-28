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
  private apiUrl = 'http://localhost:8000/api';

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
    
    // Kényszerített frissítés a szerverről, hogy meglegyen az iskola_nev
    this.http.get<any>(`${this.apiUrl}/get_user_details.php?id=${this.currentUser.id}`).subscribe({
      next: (fullUser) => {
        this.currentUser = fullUser;
        // Elmentjük a friss, JOIN-olt adatokat (iskola_nev-vel együtt)
        localStorage.setItem('user', JSON.stringify(fullUser));
      }
    });

    this.loadSchedule();
    this.loadMySubjects();
  }
}

  // --- NAPTÁR GENERÁLÁS ÉS NAVIGÁCIÓ ---

  loadSchedule() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`${this.apiUrl}/get_schedule.php?tanar_id=${this.currentUser.id}`).subscribe({
      next: (data) => {
        this.idopontok = data || [];
        this.generateCalendar(); // A rácsos naptár frissítése
      },
      error: (err) => console.error("Hiba az órarend betöltésekor", err)
    });
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    this.calendarDays = [];

    let startDay = new Date(this.currentDate);
    let daysToGenerate = 42; // Alapértelmezett hónap nézet

    if (this.view === 'month') {
      // Hónap első napja, majd vissza az első hétfőig
      const firstDayOfMonth = new Date(year, month, 1);
      startDay = new Date(firstDayOfMonth);
      const dayOfWeek = startDay.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDay.setDate(startDay.getDate() + diff);
      daysToGenerate = 42;
    }
    else if (this.view === 'week') {
      // Aktuális hét hétfője
      const dayOfWeek = startDay.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      startDay.setDate(startDay.getDate() + diff);
      daysToGenerate = 7;
    }
    else if (this.view === 'day') {
      // Csak a kiválasztott nap
      daysToGenerate = 1;
    }

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      const dateString = this.formatDate(date);

      const dailySlots = this.idopontok.filter(s => s.datum === dateString).map(s => ({
        ...s,
        isFree: s.diak_id === null,
        startShort: s.kezdes.substring(0, 5),
        endShort: s.befejezes.substring(0, 5)
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

  // --- PANEL ÉS MODAL KEZELÉS ---

  toggleAddPanel() {
    this.isAddPanelOpen = !this.isAddPanelOpen;
  }

  // --- ADATKEZELÉS ---

  loadMySubjects() {
    if (!this.currentUser?.id) return;
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

    this.http.post(`${this.apiUrl}/add_idopont.php`, payload).subscribe({
      next: () => {
        alert("Időpont sikeresen rögzítve!");
        this.loadSchedule();
        this.ujIdopont = { cim: '', datum: '', kezdes: '', befejezes: '', tantargy_id: '' };
        this.isAddPanelOpen = false; // Panel bezárása mentés után
      },
      error: (err) => alert("Hiba a mentés során!")
    });
  }

  // Ez kiszűri az összes olyan slotot a calendarDays-ből, ami foglalt (van diak_id)
  get upcomingMeetings() {
    const meetings: any[] = [];
    this.calendarDays.forEach(day => {
      day.slots.forEach((slot: any) => {
        if (slot.diak_id) {
          meetings.push({
            date: day.date,
            cim: slot.cim,
            kezdes: slot.kezdes,
            befejezes: slot.befejezes
          });
        }
      });
    });
    // Sorba rendezzük dátum szerint és csak az első 5-öt mutatjuk
    return meetings.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  }

  // --- SEGÉDFÜGGVÉNYEK ---

  // Segédfüggvény a monogramhoz (Avatar)
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