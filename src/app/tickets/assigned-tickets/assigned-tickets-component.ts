import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-assigned-tickets',
  templateUrl: './assigned-tickets-component.html',
   imports:[CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  styleUrls: ['./assigned-tickets-component.css']
})
export class AssignedTicketsComponent implements OnInit {
  formatCategory(category: string | string[]): string {
    if (!category) return '';
    const map: { [key: string]: string } = {
      'APP-RELATED': 'Application',
      'HELPDESK': 'Help-desk'
    };
    if (Array.isArray(category)) {
      return category.map(cat => map[cat] || cat).join(', ');
    }
    return map[category] || category;
  }
  assignedTickets: any[] = [];
  allTickets: any[] = [];
  loading = false;

  totalTickets: number = 0;
  totalSolved: number = 0;
  totalInProgress: number = 0;
  totalClosed: number = 0;
  totalCancelled: number = 0;
  totalAssigned: number = 0;
  totalApproved: number = 0;
  selectedStateFilter: string = 'ALL';
  user: any = {};
  sidebarCollapsed: boolean = false;

  constructor(
    private appService: ApplicationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const dev = JSON.parse(localStorage.getItem('user')|| '').email
    this.appService.getAssignedTickets(dev).subscribe((tickets: any[]) => {
      console.log('Assigned to me : ', tickets)
      this.allTickets = tickets;
      this.assignedTickets = tickets.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
      this.calculateKPIs();
      this.loading = false;
    });
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/authentification']);
      return;
    }
    this.user = JSON.parse(userStr);
  }

  openTicket(ticket: any) {
    console.log('opening tic : ', ticket)
    if (ticket.status === 'ASSIGNED') {
      this.appService.inProgressStatus(ticket.id).subscribe(() => {
        ticket.status = 'INPROGRESS';
        this.router.navigate(['/tickets/ticdetails/devTech', ticket.id]);
      });
    } else if ([
      'IN_PROGRESS',
      'SOLVED',
      'APPROVED',
      'NOTAPPROVED',
      'CLOSED',
      'CANCELLED'
    ].includes(ticket.status)) {
      this.router.navigate(['/tickets/ticdetails/devTech', ticket.id]);
    } else {
      this.router.navigate(['/tickets/details', ticket.id]);
    }
  }
  get filteredTickets() {
    if (this.selectedStateFilter === 'ALL') return this.assignedTickets;
    if (this.selectedStateFilter === 'IN_PROGRESS') {
      return this.assignedTickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED');
    }
    return this.assignedTickets.filter(t => t.status === this.selectedStateFilter);
  }

  getStatusClass(status: string): string {
    if (!status) return '';
    if (status === 'DELAYED') return 'status-inprogress';
    return 'status-' + status.toLowerCase();
  }

  calculateKPIs() {
    const tickets = this.assignedTickets;
    this.totalTickets = tickets.length;
    this.totalAssigned = tickets.filter(t => t.status === 'ASSIGNED').length;
    this.totalInProgress = tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED').length;
    this.totalSolved = tickets.filter(t => t.status === 'SOLVED').length;
    this.totalApproved = tickets.filter(t => t.status === 'APPROVED').length;
    this.totalClosed = tickets.filter(t => t.status === 'CLOSED').length;
    this.totalCancelled = tickets.filter(t => t.status === 'CANCELLED').length;
  }
  filterByState(state: string) {
    this.selectedStateFilter = state;
    let filtered;
    if (state === 'ALL') {
      filtered = this.allTickets;
    } else if (state === 'IN_PROGRESS') {
      filtered = this.allTickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'DELAYED');
    } else {
      filtered = this.allTickets.filter(t => t.status === state);
    }
    this.assignedTickets = filtered.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    this.calculateKPIs();
  }
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  }

