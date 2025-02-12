import { Component } from '@angular/core';
import { HistoryService } from '../history.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  users: any[] = [];
  paginatedUsers: any[] = [];
  filteredUsers: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 1;
  showLatest: boolean = false;

  constructor(private historyService: HistoryService) {}

  // ngOnInit(): void {
  //   this.historyService.getUsers().subscribe((data) => {
  //     this.users = data; // เก็บข้อมูลจาก API
  //   });
  // }

  ngOnInit() {
    this.fetchHistory();
  }

  fetchHistory() {
    this.historyService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = [...this.users]; // ✅ กำหนดค่าเริ่มต้นให้ filteredUsers
      this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
      this.updatePagination();
    });
  }

  showLatestOnly() {
    const latestEntries = new Map();

    this.users.forEach(user => {
      if (!latestEntries.has(user.user_id) || new Date(user.timestamp) > new Date(latestEntries.get(user.user_id).timestamp)) {
        latestEntries.set(user.user_id, user);
      }
    });

    this.filteredUsers = Array.from(latestEntries.values());
    this.showLatest = true;
    this.updatePagination();
  }

  showAll() {
    this.filteredUsers = [...this.users];
    this.showLatest = false;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}

