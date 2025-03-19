import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  isEditing = false;
  editingUserId: string | null = null;
  formData: any = {};
  selectedFile: File | null = null;

  constructor(private userService: UsermanagementService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  updateFormFields(): void {
    if (this.formData.role === 'student' || this.formData.role === 'teacher') {
      this.formData.standing = 'Com-Tech';
    } else {
      this.formData.standing = '-';
    }
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

  validateEnglishInput(event: KeyboardEvent): void {
    const char = event.key;
    const pattern = /^[A-Za-z ]+$/;
    if (!pattern.test(char)) {
      event.preventDefault();
    }
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.formData = { ...user };
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  updateUser(): void {
    if (!this.editingUserId) return;

    const formData = new FormData();

    // ลบ image_url ออกจากข้อมูลก่อนส่งไปยัง API
    const sanitizedData = { ...this.formData };
    delete sanitizedData.image_url;

    // เพิ่มข้อมูลที่ต้องการอัปเดตลงใน FormData
    Object.keys(sanitizedData).forEach(key => {
      formData.append(key, sanitizedData[key]);
    });

    // ถ้ามีการอัปโหลดไฟล์ใหม่ ให้อัปโหลดไปที่ Firebase Storage
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.userService.updateUser(this.editingUserId, formData).subscribe({
      next: () => {
        this.fetchUsers();
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Error updating user:', err);
      }
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.formData = {};
    this.selectedFile = null;
  }

  deleteUser(userId: string): void {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้นี้?")) {
      return;
    }

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== userId);
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }
}
