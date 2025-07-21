import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HeaderComponent } from 'src/app/components/header';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admintic',
  standalone: true,
  imports:[
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './admintic.html',
  styleUrl: './admintic.css'
})
export class Admintic implements OnInit {
  tickets: any[] = [];
  kpi: { [status: string]: number } = {};
  selectedStatus: string | null = null;
  statusOrder: string[] = [
    'TOTAL', 'ASSIGNED', 'IN PROGRESS', 'SOLVED', 'APPROVED', 'CLOSED', 'CANCELLED'
  ];
  sidebarCollapsed: boolean = false;

  totalTickets: number = 0;
  totalSolved: number = 0;
  totalInProgress: number = 0;
  totalClosed: number = 0;
  totalCancelled: number = 0;
  totalAssigned: number = 0;
  totalApproved: number = 0;
  selectedStateFilter: string = 'ALL';
  user: any = {};

  getStatusClassName(status: string): string {
    // Remove spaces and lowercase for class name
    return status.replace(/ /g, '').toLowerCase();
  }

  constructor(private appService: ApplicationService, private router: Router) {}

  ngOnInit() {
    this.appService.getAllTickets().subscribe((data: any[]) => {
      // Sort tickets from newest to oldest
      this.tickets = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    });
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/authentification']);
      return;
    }
    this.user = JSON.parse(userStr);
  }
  
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

  get filteredTickets() {
    if (this.selectedStateFilter === 'ALL') return this.tickets;
    return this.tickets.filter(t => t.status === this.selectedStateFilter);
  }

  getStatusClass(status: string): string {
  return status ? 'status-' + status.toLowerCase() : '';
}

  getKPIs() {
    this.appService.countApproved(this.user.email).subscribe(data => {
      this.totalApproved = data;
      console.log('approved',data);
    });
    this.appService.countSolved(this.user.email).subscribe(data => {
      this.totalSolved = data;
      console.log('solved',data);
    });
    this.appService.countCancelled(this.user.email).subscribe(data => {
      this.totalCancelled = data;
      console.log('cancelled',data);
    });
    this.appService.countInprogress(this.user.email).subscribe(data => {
      this.totalInProgress = data;
      console.log('in progress',data);
    });
    this.appService.countAssigned(this.user.email).subscribe(data => {
      this.totalAssigned = data;
      console.log('assigned',data);
    });
    this.appService.countClosed(this.user.email).subscribe(data => {
      this.totalClosed= data;
      console.log('closed',data);
      // Calculate total tickets after all KPI values are updated
      setTimeout(() => {
        this.totalTickets =
          this.totalApproved +
          this.totalSolved +
          this.totalCancelled +
          this.totalInProgress +
          this.totalAssigned +
          this.totalClosed;
      }, 200);
    });
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
   filterByState(state: string) {
    this.selectedStateFilter = state;
    // this.currentPage = 0;
    this.appService.getAllTickets().subscribe((data: any[]) => {
      // Sort tickets from newest to oldest
      this.tickets = data.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    });
  }
}
