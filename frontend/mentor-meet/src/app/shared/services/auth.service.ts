import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // ✅ A localhost:8000-et töröljük, a proxy /api/ előtagot használjuk
  private baseUrl = '/api';
  private router = inject(Router);

  constructor(private http: HttpClient) { }

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
    return this.http.post<any>(`${this.baseUrl}/login.php`, credentials);
  }

  //Kijelentkezésnél törli a memóriát
  logout() {
    localStorage.removeItem('user'); // Töröljük a mentett usert
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