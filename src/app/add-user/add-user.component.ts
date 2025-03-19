import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  users: any[] = [];
  latestUser: any = {};

  formData: any = {
    name: '',
    role: '',
    studyClass: '',
    total_attendance: '0',
    standing: '',
    last_attendance_time: new Date().toISOString().slice(0, 19).replace('T', ' '),
    Room_Number: '',
  };

  profileImage: File | null = null;
  faceImages: File[] = [];

  constructor(private userService: UsermanagementService, private router: Router) {}

  // ✅ โหลดข้อมูลผู้ใช้ล่าสุด
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        if (data) {
          const usersArray = Object.values(data);
          if (usersArray.length > 0) {
            const maxRoomNumber = Math.max(...usersArray.map((user: any) => parseInt(user.Room_Number, 10) || 0), 0);
            this.users = usersArray.filter((user: any) => parseInt(user.Room_Number, 10) === maxRoomNumber);
            this.latestUser = this.users.length > 0 ? this.users[0] : {};
            this.formData.Room_Number = (maxRoomNumber + 1).toString();
          } else {
            // ✅ กรณีไม่มีผู้ใช้ในระบบเลย กำหนด Room_Number เป็น "1"
            this.formData.Room_Number = "1";
          }
        }
      },
      error: (err) => {
        console.error('❌ Error fetching users:', err);
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
      this.formData.studyClass = 'Database'; // ✅ ตั้งค่า studyClass ให้เป็นค่าเริ่มต้น
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


    this.userService.addUser(formData).subscribe({
      next: (response) => {
        alert(`✅ เพิ่มผู้ใช้สำเร็จ! \n⏰ เวลาเข้าร่วมล่าสุด: ${response.last_attendance_time}`);


        if (this.faceImages.length > 0) {
          this.userService.uploadFaceImages(this.formData.Room_Number, this.faceImages).subscribe({
            next: () => {
              alert(`✅ อัปโหลดรูปสำหรับจดจำใบหน้าเสร็จสิ้น!`);
              this.router.navigate(['/history']);
            },
            error: (err) => {
              console.error('❌ Error uploading face images:', err);
              alert('❌ เกิดข้อผิดพลาดในการอัปโหลดรูปใบหน้า');
            }
          });
        } else {
          this.router.navigate(['/history']);
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
