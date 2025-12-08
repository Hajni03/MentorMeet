import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/register.php'; // ✅ cseréld, ha máshol van

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
