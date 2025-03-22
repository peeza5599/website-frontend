import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  profileImage: File | null = null;
  faceImages: File[] = [];

  formData: any = {
    name: '',
    role: '',
    studyClass: '', // ✅ ค่าเริ่มต้น
    total_attendance: '0',
    standing: '',
    last_attendance_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  constructor(private userService: UsermanagementService, private router: Router) {}

  // ✅ ฟังก์ชันเลือกไฟล์โปรไฟล์
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = file;
    }
  }

  validateEnglishInput(event: KeyboardEvent): void {
    const char = event.key;
    const pattern = /^[A-Za-z ]+$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

  updateFormFields(): void {
    if (this.formData.role === 'student' || this.formData.role === 'teacher') {
      this.formData.standing = 'Com-Tech';
      this.formData.studyClass = 'Database'; // ✅ ค่าเริ่มต้น
    } else {
      this.formData.standing = '-';
      this.formData.studyClass = '-'; // ✅ กำหนดค่าเป็น "-" สำหรับ visitor
    }
  }

  // ✅ ฟังก์ชันเลือกไฟล์ใบหน้า (หลายรูป)
  onFaceImagesSelected(event: any): void {
    const files: File[] = Array.from(event.target.files);
    this.faceImages = [];

    files.forEach((file: File) => {
      if (file.type.startsWith('image/')) {
        this.faceImages.push(file);
      } else {
        alert(`❌ ไฟล์ ${file.name} ไม่ใช่ไฟล์รูปภาพ`);
      }
    });
  }

  // ✅ 📌 ฟังก์ชันส่งข้อมูลไป API
  onSubmit(): void {
    if (!this.formData.name) {
      alert('❌ กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();
    Object.keys(this.formData).forEach(key => {
      formData.append(key, this.formData[key]);
    });

    if (this.profileImage) {
      formData.append('image', this.profileImage);
    }

    // ✅ ส่งข้อมูลไปยัง API `add-user`
    this.userService.addUser(formData).subscribe({
      next: (response) => {
        alert(`✅ เพิ่มผู้ใช้สำเร็จ! \n⏰ เวลาเข้าร่วมล่าสุด: ${response.last_attendance_time}`);

        // ✅ ใช้ user_id ที่ได้จาก API
        const user_id = response.user_id;

        // ✅ อัปโหลดใบหน้าถ้ามี
        if (this.faceImages.length > 0) {
          this.uploadFaceImages(user_id);
        } else {
          this.router.navigate(['/history']); // ✅ ไม่มีใบหน้า → ไปหน้าประวัติทันที
        }
      },
      error: (err) => {
        console.error('❌ Error adding user:', err);
        alert('❌ เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
      }
    });
  }

  // ✅ ฟังก์ชันอัปโหลดใบหน้า พร้อม `user_id`
  uploadFaceImages(user_id: string): void {
    const faceFormData = new FormData();
    faceFormData.append('user_id', user_id); // ✅ ส่ง user_id ไปด้วย
    this.faceImages.forEach(file => {
      faceFormData.append('faceImages', file);
    });

    this.userService.uploadFaceImages(user_id, this.faceImages).subscribe({
      next: () => {
        alert(`✅ อัปโหลดรูปสำหรับจดจำใบหน้าเสร็จสิ้น!`);
        this.router.navigate(['/history']);
      },
      error: (err) => {
        console.error('❌ Error uploading face images:', err);
        alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปใบหน้า');
      }
    });
  }

  // 📌 ฟังก์ชันยกเลิก
  cancel(): void {
    this.router.navigate(['/']);
  }
}
