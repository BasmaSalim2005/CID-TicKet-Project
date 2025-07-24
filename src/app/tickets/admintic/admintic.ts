  
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
  // ...existing code...
  getAdminTicketLink(ticketId: number) {
    this.router.navigate(['/tickets/ticdetails/admin', ticketId]);
  }

  formatCategory(category: string): string {
    if (!category) return '';
    const map: { [key: string]: string } = {
      'APP_RELATED': 'Application',
      'HLEPDESK': 'Help-Desk',
      // Add more mappings as needed
    };
    return map[category] || this.capitalizeText(category.replace(/_/g, ' '));
  }
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
    this.getKPIs();
  }
  
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

  get filteredTickets() {
    if (this.selectedStateFilter === 'ALL') return this.tickets;
    else if(this.selectedStateFilter === 'DELAYED' || this.selectedStateFilter === 'IN_PROGRESS') return this.tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED');
    return this.tickets.filter(t => t.status === this.selectedStateFilter);
  }

  getStatusClass(status: string): string {
  return status ? 'status-' + status.toLowerCase() : '';
}

  getKPIs() {
    this.appService.getAllTickets().subscribe((tickets: any[]) => {
      this.totalApproved = tickets.filter(t => t.status === 'APPROVED').length;
      this.totalSolved = tickets.filter(t => t.status === 'SOLVED').length;
      this.totalCancelled = tickets.filter(t => t.status === 'CANCELLED').length;
      this.totalInProgress = tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED').length;
      this.totalAssigned = tickets.filter(t => t.status === 'ASSIGNED').length;
      this.totalClosed = tickets.filter(t => t.status === 'CLOSED').length;
      this.totalTickets = tickets.length;
      console.log('KPI counts:', {
        approved: this.totalApproved,
        solved: this.totalSolved,
        cancelled: this.totalCancelled,
        inProgress: this.totalInProgress,
        assigned: this.totalAssigned,
        closed: this.totalClosed,
        total: this.totalTickets
      });
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
