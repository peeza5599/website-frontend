import { Component, OnInit } from '@angular/core';
import { ImageService } from './image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  images: string[] = []; // ตัวแปรเก็บ URL รูปภาพ

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    // เรียก Service เพื่อดึง URL ของรูป
    this.imageService.getImages().subscribe(
      (data) => {
        this.images = data.images; // เก็บ URL ในตัวแปร
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }
}
