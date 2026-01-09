import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardLayoutComponent } from '../dashboard-layout/dashboard-layout';
// Megjegyzés: Ha a DashboardLayoutComponent a szülője ennek a komponensnek (ebben van benne a router-outlet), 
// akkor NEM kell ide beimportálni az imports-ba!

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardLayoutComponent], // DashboardLayoutComponent-et kivettem, ha ez egy al-oldal
  templateUrl: './teacher-dashboard.html',
  styleUrl: './teacher-dashboard.scss'
})
export class TeacherDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  currentUser: any = null;
  idopontok: any[] = [];
  isEditMode: boolean = false;
  mySubjects: any[] = [];
  hetiNapok = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap'];

  ujIdopont = { datum: '', kezdes: '', befejezes: '', tantargy_id: '' };

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.currentUser = JSON.parse(userData);
        if (this.currentUser && this.currentUser.id) {
          this.loadSchedule();
          this.loadMySubjects();
        }
      } catch (e) {
        console.error("Hiba a felhasználói adatok parszolásakor", e);
      }
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  loadSchedule() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`/api/get_schedule.php?tanar_id=${this.currentUser.id}`).subscribe({
      next: (data) => {
        this.idopontok = data || [];
        console.log('Sikeres betöltés:', this.idopontok);
      },
      error: (err) => {
        console.error("Hiba az órarend betöltésekor", err);
        this.idopontok = [];
      }
    });
  }

  loadMySubjects() {
    if (!this.currentUser?.id) return;

    this.http.get<any[]>(`/api/get_tanar_tantargyak.php?tanar_id=${this.currentUser.id}`).subscribe({
      next: (data) => {
        this.mySubjects = data || [];
      },
      error: (err) => {
        console.error("Hiba a tantárgyak betöltésekor", err);
        this.mySubjects = [];
      }
    });
  }

  addIdopont() {
    if (!this.ujIdopont.datum || !this.ujIdopont.kezdes || !this.ujIdopont.befejezes) {
      alert("Kérlek tölts ki minden időpont mezőt!");
      return;
    }

    const payload = {
      tanar_id: this.currentUser.id,
      datum: this.ujIdopont.datum,
      kezdes: this.ujIdopont.kezdes,
      befejezes: this.ujIdopont.befejezes,
      // Ha nem választott tantárgyat, küldjünk NULL-t vagy 0-t
      tantargy_id: this.ujIdopont.tantargy_id || null
    };

    this.http.post('/api/add_idopont.php', payload).subscribe({
      next: (res: any) => {
        alert("Időpont sikeresen rögzítve!");
        this.loadSchedule();
        this.ujIdopont = { datum: '', kezdes: '', befejezes: '', tantargy_id: '' };
      },
      error: (err) => alert("Hiba a mentés során!")
    });
  }

  deleteIdopont(id: number) {
    if (confirm('Biztosan törlöd ezt az időpontot?')) {
      this.http.post('/api/delete_idopont.php', { id: id }).subscribe({
        next: (res: any) => {
          alert(res.message);
          this.loadSchedule();
        },
        error: (err) => alert("Hiba a törlés során!")
      });
    }
  }

  getWeekday(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('hu-HU', { weekday: 'long' });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  }

  //Szűrés: már foglalt időpontok
  get bookedSlots() {
  return this.idopontok
    .filter(slot => slot.diak_id !== null && slot.diak_id !== undefined)
    .sort((a, b) => {
      // Dátum és idő szerinti sorbarendezés (hogy a legközelebbi legyen legfelül)
      const dateA = new Date(a.datum + ' ' + a.kezdes).getTime();
      const dateB = new Date(b.datum + ' ' + b.kezdes).getTime();
      return dateA - dateB;
    })
    .slice(0, 3); // Csak az első 3-at kérjük le
}
}