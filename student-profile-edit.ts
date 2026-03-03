import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-profile-edit.html',
  styleUrl: './student-profile-edit.scss'
})
export class StudentProfileEdit implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Egységesített API elérési út
  private readonly apiUrl = 'https://mentormeet.hu/backend/api';

  user: any = {
    id: null,
    nev: '',
    iskola_nev: '',
    szak_id: null,
    bio: '',
    profil_kep: ''
  };
  
  isSaving = false;
  szakokListaja: any[] = [];

  ngOnInit() {
    this.loadSzakok();
    const userData = localStorage.getItem('user');
    if (userData) {
      const tempUser = JSON.parse(userData);
      // Itt fontos, hogy legyen ID-nk a betöltéshez
      if (tempUser && tempUser.id) {
        this.loadUserData(tempUser.id);
      }
    }
  }

 loadUserData(id: number) {
  this.http.get(`${this.apiUrl}/get_user_details.php?id=${id}`).subscribe({
    next: (data: any) => {
      this.user = data;
      // Ha az adatbázisból profilkep_eleres néven jön, de a HTML profil_kep-et vár:
      if (data.profilkep_eleres) {
        this.user.profil_kep = data.profilkep_eleres;
      }
    },
    error: (err) => console.error('Hiba', err)
  });
}

  loadSzakok() {
    this.http.get<any[]>(`${this.apiUrl}/get_szakok.php`).subscribe({
      next: (data) => this.szakokListaja = data,
      error: (err) => console.error('Hiba a szakok betöltésekor', err)
    });
  }

  saveProfile() {
    this.isSaving = true;
    this.http.post(`${this.apiUrl}/update_student_profile.php`, this.user).subscribe({
      next: (res: any) => {
        // Frissítjük a localStoraget az új adatokkal
        localStorage.setItem('user', JSON.stringify(this.user));
        alert('Profil sikeresen frissítve!');
        this.router.navigate(['/student-dashboard']);
      },
      error: (err) => {
        console.error('Mentési hiba:', err);
        alert('Hiba történt a mentés során!');
        this.isSaving = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/student-dashboard']);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // 1. Azonnali kép-előnézet (UX javítás)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profil_kep = e.target.result;
      };
      reader.readAsDataURL(file);

      // 2. Tényleges feltöltés
      this.uploadProfileImage(file);
    }
  } // <--- Itt hiányzott a zárójel!

  uploadProfileImage(file: File) {
    if (!this.user.id) {
      alert('Hiba: Nem található felhasználói azonosító!');
      return;
    }

    const formData = new FormData();
    formData.append('profile_pic', file);
    formData.append('user_id', this.user.id.toString());

    // Itt is az egységes apiUrl változót használjuk
    this.http.post(`${this.apiUrl}/upload_profile_pic.php`, formData)
      .subscribe({
        next: (res: any) => {
          if (res && res.url) {
            this.user.profil_kep = res.url;
            // Opcionális: a localStorage-ban is frissítheted a képet azonnal
            console.log('Kép sikeresen feltöltve:', res.url);
          }
        },
        error: (err) => {
          console.error('Feltöltési hiba:', err);
          alert('Hiba történt a kép feltöltésekor.');
        }
      });
  }
}