import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teacher-profile-edit.html',
  styleUrl: './teacher-profile-edit.scss'
})
export class TeacherProfileEditComponent implements OnInit {
  private http = inject(HttpClient);
  // ✅ Központi API útvonal HTTPS-el
  private readonly apiUrl = 'https://mentormeet.hu/backend/api';

  currentUser: any = null;
  allSubjects: any[] = [];     // Minden választható tárgy a DB-ből
  mySubjects: any[] = [];      // Amit ez a tanár tanít
  selectedSubjectId: string = '';

  ngOnInit() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadAllSubjects();
      this.loadMySubjects();
    }
  }

  // ✅ JAVÍTVA: Itt a get_all_subjects.php-t kell hívni a teljes listához!
  loadAllSubjects() {
    this.http.get<any[]>(`${this.apiUrl}/get_all_subjects.php`).subscribe({
      next: (res) => {
        this.allSubjects = res || [];
        console.log('Összes választható tantárgy:', this.allSubjects);
      },
      error: (err) => console.error("Hiba a tantárgyak betöltésekor", err)
    });
  }

  loadMySubjects() {
    this.http.get<any[]>(`${this.apiUrl}/get_tanar_tantargyak.php?tanar_id=${this.currentUser.id}`)
      .subscribe({
        next: (res) => {
          this.mySubjects = res || [];
          console.log('Saját tantárgyak:', this.mySubjects);
        },
        error: (err) => console.error("Hiba a saját tantárgyak betöltésekor", err)
      });
  }

  addSubject() {
    if (!this.selectedSubjectId) return;

    const payload = {
      tanar_id: this.currentUser.id,
      tantargy_id: this.selectedSubjectId
    };

    this.http.post(`${this.apiUrl}/save_tantargy.php`, payload).subscribe({
      next: (res: any) => {
        this.loadMySubjects(); // Frissítjük a listát a képernyőn
        this.selectedSubjectId = ''; // Alaphelyzetbe állítjuk a választót
      },
      error: (err) => alert("Hiba a mentés során!")
    });
  }

  deleteSubject(tantargyId: any) {
    if (!tantargyId) {
      console.error("Hiba: Nincs tantárgy azonosító a törléshez!");
      return;
    }

    if (confirm('Biztosan el akarod távolítani ezt a tantárgyat?')) {
      const payload = {
        tanar_id: this.currentUser.id,
        tantargy_id: tantargyId
      };

      this.http.post(`${this.apiUrl}/delete_tanar_tantargy.php`, payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.loadMySubjects();
          } else {
            alert("Szerver hiba: " + res.message);
          }
        },
        error: (err) => {
          console.error('Hálózati hiba törléskor:', err);
          alert("Nem sikerült elérni a szervert a törléshez!");
        }
      });
    }
  }

  saveDetails() {
    const payload = {
      id: this.currentUser.id,
      telefonszam: this.currentUser.telefonszam,
      szuletes_datum: this.currentUser.szuletes_datum,
      bemutatkozas: this.currentUser.bemutatkozas
    };

    this.http.post(`${this.apiUrl}/update_user_details.php`, payload).subscribe({
      next: (res: any) => {
        alert(res.message || "Adataid sikeresen frissítve!");
        localStorage.setItem('user', JSON.stringify(this.currentUser));
      },
      error: (err) => {
        console.error(err);
        alert("Hiba történt a mentés során!");
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      console.log("Kiválasztott fájl feltöltésre vár:", file.name);
    }
  }

  // ✅ JAVÍTVA: A baseUrl a backend gyökerére mutasson a képek miatt
  getAvatarUrl(path: string | null): string {
    if (!path) return 'assets/images/profilkep_placeholder.jpg';
    if (path.startsWith('http')) return path;

    const baseUrl = 'https://mentormeet.hu/backend/'; 
    return baseUrl + path;
  }
}