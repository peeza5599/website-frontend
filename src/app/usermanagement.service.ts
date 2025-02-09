import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {
  private apiUrl = 'http://127.0.0.1:5000/api/realtime-data';
  private updateUrl = 'http://127.0.0.1:5000/api/update-user/';
  private deleteUrl = 'http://127.0.0.1:5000/api/delete-user/';
  private adduserUrl = 'http://127.0.0.1:5000/api/add-user';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  updateUser(userId: string, data: FormData): Observable<any> {
    return this.http.put<any>(this.updateUrl + userId, data);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(this.deleteUrl + userId);
  }

  addUser(userData: any): Observable<any> {
    return this.http.post(`${this.adduserUrl}`, userData);
  }
}
