import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) { }

    // ฟังก์ชันดึงข้อมูลผู้ใช้งาน
    getUsers(): Observable<any> {
      return this.http.get(this.apiUrl);
    }
}
