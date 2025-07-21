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
  assignedTickets: any[] = [];
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
    this.appService.getAssignedTicket(dev).subscribe(tickets => {
      console.log('Assigned to me : ', tickets)
      this.assignedTickets = tickets.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
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
        ticket.status = 'in-progress';
        this.router.navigate(['/tickets/ticdetails/devTech', ticket.id]);
      });
    } else {
      this.router.navigate(['/tickets/details', ticket.id]);
    }
  }
  get filteredTickets() {
    if (this.selectedStateFilter === 'ALL') return this.assignedTickets;
    return this.assignedTickets.filter(t => t.status === this.selectedStateFilter);
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
   filterByState(state: string) {
    this.selectedStateFilter = state;
    // this.currentPage = 0;
    this.appService.getAssignedTicket(this.user.email).subscribe(data => {
      this.assignedTickets = data.sort((a:any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
    });
  }
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  }

