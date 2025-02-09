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
    total_attendance: '0',  // แก้เป็น string เพราะ Firebase บันทึกเป็น string
    standing: '',
    last_attendance_time: new Date().toISOString().slice(0, 19).replace('T', ' ')  // เวลาปัจจุบัน
  };
  selectedFile: File | null = null;

  constructor(private userService: UsermanagementService, private router: Router) {}

  // 📌 ฟังก์ชันเลือกไฟล์
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // 📌 ฟังก์ชันส่งข้อมูลไป API
  onSubmit(): void {
    if (!this.formData.name || !this.formData.Room_Number) {
      alert('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const formData = new FormData();
    Object.keys(this.formData).forEach(key => {
      formData.append(key, this.formData[key]);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.userService.addUser(formData).subscribe({
      next: (response) => {
        alert(`✅ เพิ่มผู้ใช้สำเร็จ! \n⏰ เวลาเข้าร่วมล่าสุด: ${response.last_attendance_time}`);
        this.router.navigate(['/']); // กลับไปหน้าหลัก
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
