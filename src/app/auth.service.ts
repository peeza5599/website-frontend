import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://website-backend-o383.onrender.com/api/login'; // URL Backend API

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับ Login
  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { username, password });
  }
}
