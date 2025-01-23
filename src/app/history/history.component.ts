import { Component } from '@angular/core';
import { HistoryService } from '../history.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  users: any[] = [];

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.historyService.getUsers().subscribe((data) => {
      this.users = data; // เก็บข้อมูลจาก API
    });
  }

}
