import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {
  private apiUrl = 'http://127.0.0.1:5000/api/realtime-data'; // URL ของ API
  private deleteUrl = 'http://127.0.0.1:5000/api/delete-user/';

  constructor(private http: HttpClient) { }

    // ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ทั้งหมดจาก API
    getUsers(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }

    deleteUser(userId: string): Observable<any> {
      return this.http.delete<any>(this.deleteUrl + userId);
    }
}
