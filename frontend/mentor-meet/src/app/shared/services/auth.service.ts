import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ A localhost:8000-et töröljük, a proxy /api/ előtagot használjuk
  private baseUrl = 'https://mentormeet.hu/backend/api';
  private router = inject(Router);

  isLoggedIn = signal<boolean>(false);
  private http = inject(HttpClient);

  constructor() { }

  // Diák regisztráció
  registerStudent(data: any): Observable<any> {
    const studentData = { ...data, szerep: 'diak' }; // Hozzáadjuk a szerepkört
    return this.http.post<any>(`${this.baseUrl}/register.php`, studentData);
  }

  // Tanár regisztráció
  registerTeacher(data: any): Observable<any> {
    const teacherData = { ...data, szerep: 'tanar' }; // Hozzáadjuk a szerepkört
    return this.http.post<any>(`${this.baseUrl}/register_tanar.php`, teacherData);
  }

  //LOGIN

  login(credentials: { email: string; jelszo: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login.php`, credentials).pipe(
    tap(response => {
      if (response && response.success) {
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isLoggedIn.set(true); // <--- Itt váltunk "bejelentkezett" módba
      }
    })
  );
  }

  //Kijelentkezésnél törli a memóriát
  logout() {
    localStorage.removeItem('user'); // Töröljük a mentett usert
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  //Kapcsolatok kezelése - ismerősnek jelölések

  //Tanárok, diákok lekérdezése
  getUsers(currentId: number, role: string, search: string = ''): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get_users.php?current_id=${currentId}&role=${role}&search=${search}`);
  }
  //Barátnak jelölések
   addContact(diakId: number, tanarId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add_contact.php`, {
      diak_id: diakId,
      tanar_id: tanarId
    });
  }

}