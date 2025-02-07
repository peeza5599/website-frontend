import { Component, OnInit } from '@angular/core';
import { UsermanagementService } from '../usermanagement.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})
export class UsermanagementComponent implements OnInit {
  users: any[] = [];  // เก็บข้อมูลผู้ใช้
  isLoading = true;   // สถานะการโหลดข้อมูล

  constructor(private userService: UsermanagementService) {}

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
