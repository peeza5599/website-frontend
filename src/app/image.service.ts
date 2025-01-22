import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://localhost:5000/images'; // URL ของ Backend

  constructor(private http: HttpClient) {}

  getImages(): Observable<{ images: string[] }> {
    return this.http.get<{ images: string[] }>(this.apiUrl);
  }
}
