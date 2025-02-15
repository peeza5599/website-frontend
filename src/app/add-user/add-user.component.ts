import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  formData: any = {
    name: '',
    Room_Number: '',
    starting_year: '',
    total_attendance: '0', // แก้เป็น string เพราะ Firebase บันทึกเป็น string
    standing: '',
    last_attendance_time: new Date().toISOString().slice(0, 19).replace('T', ' ') // เวลาปัจจุบัน
  };

  profileImage: File | null = null;
  faceImages: File[] = [];

  constructor(private userService: UsermanagementService, private router: Router) {}

  // ✅ ฟังก์ชันเลือกไฟล์โปรไฟล์
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = file;
    }
  }

  // ✅ ฟังก์ชันเลือกไฟล์สำหรับจดจำใบหน้า (อัปโหลดหลายไฟล์)
  onFaceImagesSelected(event: any): void {
    const files: File[] = Array.from(event.target.files) as File[];
    this.faceImages = [];

    files.forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        this.faceImages.push(file);
      } else {
        alert(`❌ ไฟล์ ${file.name} ไม่ใช่ไฟล์รูปภาพ`);
      }
    });
  }

  // ✅ 📌 ฟังก์ชันส่งข้อมูลไป API (อัปเดตใหม่)
  onSubmit(): void {
    if (!this.formData.name || !this.formData.Room_Number) {
      alert('❌ กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();
    Object.keys(this.formData).forEach(key => {
      formData.append(key, this.formData[key]);
    });

    // ✅ อัปโหลดรูปโปรไฟล์
    if (this.profileImage) {
      formData.append('image', this.profileImage);
    }

    // ✅ Step 1: อัปโหลดข้อมูลผู้ใช้ก่อน
    this.userService.addUser(formData).subscribe({
      next: (response) => {
        alert(`✅ เพิ่มผู้ใช้สำเร็จ! \n⏰ เวลาเข้าร่วมล่าสุด: ${response.last_attendance_time}`);

        // ✅ Step 2: อัปโหลดรูปสำหรับจดจำใบหน้า (ถ้ามี)
        if (this.faceImages.length > 0) {
          this.userService.uploadFaceImages(this.formData.Room_Number, this.faceImages).subscribe({
            next: () => {
              alert(`✅ อัปโหลดรูปสำหรับจดจำใบหน้าเสร็จสิ้น!`);
              this.router.navigate(['/history']); // กลับไปหน้าหลัก
            },
            error: (err) => {
              console.error('❌ Error uploading face images:', err);
              alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปใบหน้า');
            }
          });
        } else {
          this.router.navigate(['/history']); // ถ้าไม่มีรูปใบหน้า ไปหน้า History ทันที
        }
      },
      error: (err) => {
        console.error('❌ Error adding user:', err);
        alert('❌ เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
      }
    });
  }

  // 📌 ฟังก์ชันยกเลิก
  cancel(): void {
    this.router.navigate(['/']);
  }
}
