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
  private addfacereconUrl = 'http://127.0.0.1:5000/api/upload-face-images';

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

  // ✅ API สำหรับอัปโหลดรูปจดจำใบหน้า
  uploadFaceImages(userId: string, faceImages: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('user_id', userId); // ✅ ใช้ 'user_id' แทน 'Room_Number'

    faceImages.forEach((file) => {
      formData.append('faceImages', file); // ✅ ส่งรูปทั้งหมดไปยัง API
    });

    return this.http.post(`${this.addfacereconUrl}`, formData); // ✅ URL ถูกต้องแล้ว
  }
}
