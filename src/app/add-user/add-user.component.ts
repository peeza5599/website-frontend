import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  users: any[] = [];
  profileImage: File | null = null;
  faceImages: File[] = [];
  isLoading: boolean = false;

  formData: any = {
    name: '',
    role: '',
    studyClass: '', // ✅ ค่าเริ่มต้น
    total_attendance: '0',
    standing: '',
    last_attendance_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
  };

  constructor(private userService: UsermanagementService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
        this.isLoading = false;
      }
    });
  }

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

    if (files.length > 10) {
      alert('❌ จำกัดจำนวนอัปโหลดไม่เกิน 10 รูป');
      return;
    }

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
    if (!this.formData.name || this.faceImages.length > 10) {
      alert('❌ กรุณากรอกข้อมูลให้ครบ ');
      return;
    }

    const nameExists = this.users.some(user => user.name.toLowerCase() === this.formData.name.trim().toLowerCase());
    if (nameExists) {
      alert('❌ มีผู้ใช้ชื่อนี้อยู่แล้วในระบบ');
      return;
    }

    this.isLoading = true; // ✅ เริ่มโหลด

    const formData = new FormData();
    Object.keys(this.formData).forEach(key => {
      formData.append(key, this.formData[key]);
    });

    if (this.profileImage) {
      formData.append('image', this.profileImage);
    }

    this.userService.addUser(formData).subscribe({
      next: (response) => {
        const user_id = response.user_id;

        if (this.faceImages.length > 0) {
          this.uploadFaceImages(user_id);
        } else {
          this.isLoading = false;
          this.router.navigate(['/history']);
        }
      },
      error: (err) => {
        console.error('❌ Error adding user:', err);
        alert('❌ เกิดข้อผิดพลาดในการเพิ่มผู้ใช้');
        this.isLoading = false;
      }
    });
  }


  uploadFaceImages(user_id: string): void {
    const faceFormData = new FormData();
    faceFormData.append('user_id', user_id);
    this.faceImages.forEach(file => {
      faceFormData.append('faceImages', file);
    });

    this.userService.uploadFaceImages(user_id, this.faceImages).subscribe({
      next: () => {
        alert(`✅ อัปโหลดรูปสำหรับจดจำใบหน้าเสร็จสิ้น!`);
        this.isLoading = false;
        this.router.navigate(['/history']);
      },
      error: (err) => {
        console.error('❌ Error uploading face images:', err);
        alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปใบหน้า');
        this.isLoading = false;
      }
    });
  }

  // 📌 ฟังก์ชันยกเลิก
  cancel(): void {
    this.router.navigate(['/']);
  }
}
