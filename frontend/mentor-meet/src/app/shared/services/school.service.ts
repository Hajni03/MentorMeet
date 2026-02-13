import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Iskola {
  id: number;
  nev: string;
}

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api/iskolak.php'; 
  /**
   * Összes iskola lekérdezése
   */
  getIskolak(): Observable<Iskola[]> {
    return this.http.get<Iskola[]>(`${this.apiUrl}`);
  }

  /**
   * Iskola beállítása egy felhasználónak
   */
  updateUserSchool(userId: number, iskolaId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/felhasznalok/${userId}`, {
      iskola_id: iskolaId,
    });
  }
}
