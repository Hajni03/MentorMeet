// src/app/shared/services/osztaly.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Osztaly {
  id: number;
  nev: string;
  leiras: string;
  iskola_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class OsztalyService {
  private apiUrl = '/api/osztalyok.php';

  constructor(private http: HttpClient) {}

  getOsztalyokByIskola(iskolaId: number): Observable<Osztaly[]> {
    return this.http.get<Osztaly[]>(`${this.apiUrl}?iskola_id=${iskolaId}`);
  }
}
