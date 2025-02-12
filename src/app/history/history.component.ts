import { Component } from '@angular/core';
import { HistoryService } from '../history.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  users: any[] = [];
  paginatedUsers: any[] = []; // ข้อมูลที่แสดงในหน้านี้
  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalPages: number = 1;

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
      this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
      this.updatePagination();
    });
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(startIndex, endIndex);
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
