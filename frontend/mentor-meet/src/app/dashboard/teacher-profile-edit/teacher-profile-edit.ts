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

  loadAllSubjects() {
    this.http.get<any[]>('/api/get_all_subjects.php').subscribe({
      next: (res) => this.allSubjects = res,
      error: (err) => console.error("Hiba a tantárgyak betöltésekor", err)
    });
  }

  loadMySubjects() {
    this.http.get<any[]>(`/api/get_tanar_tantargyak.php?tanar_id=${this.currentUser.id}`)
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

    this.http.post('/api/save_tantargy.php', payload).subscribe({
      next: (res: any) => {
        this.loadMySubjects(); // Frissítjük a listát a képernyőn
        this.selectedSubjectId = ''; // Alaphelyzetbe állítjuk a választót
      },
      error: (err) => alert("Hiba a mentés során!")
    });
  }

  deleteSubject(tantargyId: any) {
    // Nagyon fontos: a tantargyId nem lehet üres!
    if (!tantargyId) {
      console.error("Hiba: Nincs tantárgy azonosító a törléshez!");
      return;
    }

    if (confirm('Biztosan el akarod távolítani ezt a tantárgyat?')) {
      const payload = {
        tanar_id: this.currentUser.id,
        tantargy_id: tantargyId
      };

      console.log('Törlés küldése:', payload);

      this.http.post('/api/delete_tanar_tantargy.php', payload).subscribe({
        next: (res: any) => {
          if (res.success) {
            console.log('Sikeres törlés a szerveren');
            this.loadMySubjects(); // Csak akkor frissítünk, ha a PHP is visszaigazolta
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

  // Összevontuk a savePersonalData és saveDetails metódusokat egybe, 
  // hogy ne legyen duplikáció
  saveDetails() {
    const payload = {
      id: this.currentUser.id,
      telefonszam: this.currentUser.telefonszam,
      szuletes_datum: this.currentUser.szuletes_datum,
      bemutatkozas: this.currentUser.bemutatkozas
    };

    this.http.post('/api/update_user_details.php', payload).subscribe({
      next: (res: any) => {
        alert(res.message || "Adataid sikeresen frissítve!");
        // Frissítjük a localStorage-t, hogy az új adatok megmaradjanak
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
      // Itt majd a FormData alapú feltöltés következik
    }
  }

  // Ezt add hozzá az osztályhoz
  getAvatarUrl(path: string | null): string {
    if (!path) return 'assets/images/profilkep_placeholder.jpg';

    // Ha a path már tartalmaz http-t (mert pl. külső kép), ne nyúljunk hozzá
    if (path.startsWith('http')) return path;

    // Localhoston a mappa neve kell, élesben a domain után jön az uploads
    // Ezt később az environment fájlból fogjuk dinamikusan kezelni
    const baseUrl = 'http://localhost/mentormeet/';
    return baseUrl + path;
  }
}