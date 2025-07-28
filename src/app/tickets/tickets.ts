import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../components/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
// import { EditticketDialog } from '../tickets/add-ticket-dialog/add-ticket-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../services/application-service';
import { MatDialog } from '@angular/material/dialog';
import { AddTicketDialog } from './add-ticket-dialog/add-ticket-dialog';
import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    // EditticketDialog,
    AddTicketDialog
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets {
  tickets: any[] = [];
  sidebarCollapsed: boolean = false;
  user: any = {};

  totalTickets: number = 0;
  totalSolved: number = 0;
  totalInProgress: number = 0;
  totalClosed: number = 0;
  totalCancelled: number = 0;
  totalAssigned: number = 0;
  totalApproved: number = 0;
  selectedStateFilter: string = 'ALL';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      this.router.navigate(['/authentification']);
      return;
    }
    this.user = JSON.parse(userStr);
    this.getTicketsByUser();
    // this.getKPIs();
  }

  getTicketsByUser() {
    this.applicationService.getTicketsByUser(this.user.email).subscribe({
      next: (data: any[]) => {
        this.tickets = data;
        this.totalTickets = this.tickets.length;
        this.getKPIs();
      },
      error: () => {
        this.tickets = [];
        this.totalTickets = 0;
        this.getKPIs();
      }
    });
  }

   formatCategory(category: string | string[]): string {
    if (!category) return '';
    const map: { [key: string]: string } = {
      'APP_RELATED': 'Application',
      'HELPDESK': 'Help-desk'
    };
    if (Array.isArray(category)) {
      return category.map(cat => map[cat] || cat).join(', ');
    }
    return map[category] || category;
  }

  openAddTicketDialog() {
    const dialogRef = this.dialog.open(AddTicketDialog, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationService.addTicket({ ...result, userEmail: this.user.email }).subscribe({
          next: () => this.getTicketsByUser(),
          error: err => console.error('Error adding ticket:', err)
        });
      }
    });
  }

  onticketSelected(ticketId: number) {
    // For now, just open the edit dialog for the ticket
    this.router.navigate(['tickets/ticdetails/user/:id', ticketId]);
    // const ticket = this.tickets.find(t => t.id === ticketId);
    // if (ticket) {
    //   // this.edit(ticketId, ticket);
    // }
  }

  getticketByuser(user: any) {
    this.applicationService.getTicketsByUser(user.email).subscribe({
      next: (data) => {
        console.log('users tickets data:', data); // <-- Add this line
        this.tickets = data;
      },
      error: (error: any) => {
        this.tickets = [];
      }
    });
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  navigateToApplication() {
    this.router.navigate(['/application/apps']);
  }
  navigateToTicket() {
    this.router.navigate(['/tickets/tickets']);
  }
  
  navigateToFeature() {
    this.router.navigate(['/features/features']);
  }

  navigateToFeedback() {
    this.router.navigate(['/feedback/appfeedback']);
  }
  goToTicketDetails(ticketId: number) {
    this.router.navigate(['tickets/ticdetails/user/', ticketId]);
  }



  get filteredTickets() {
    if (this.selectedStateFilter === 'ALL') return this.tickets;
    return this.tickets.filter(t => t.status === this.selectedStateFilter);
  }

  
  getKPIs() {
    this.applicationService.countApproved(this.user.email).subscribe(data => {
      this.totalApproved = data;
      console.log('approved',data);
    });
    this.applicationService.countSolved(this.user.email).subscribe(data => {
      this.totalSolved = data;
      console.log('approved',data);
    });
    this.applicationService.countCancelled(this.user.email).subscribe(data => {
      this.totalCancelled = data;
      console.log('approved',data);
    });
    this.applicationService.countInprogress(this.user.email).subscribe(data => {
      this.totalInProgress = data;
      console.log('approved',data);
    });
    this.applicationService.countAssigned(this.user.email).subscribe(data => {
      this.totalAssigned = data;
      console.log('approved',data);
    });
    this.applicationService.countClosed(this.user.email).subscribe(data => {
      this.totalClosed= data;
      console.log('approved',data);
    });
  }
  deleteticket(ticketId: number) {
    if (ticketId === undefined || ticketId === null) {
      console.error('Cannot delete ticket: ticketId is undefined or null!');
      alert('Error: ticket ID is missing. Cannot delete this ticket.');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this ticket?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.applicationService.deleteTicket(ticketId).subscribe({
          next: () => this.getticketByuser(this.user.email),
          error: err => console.error('Error deleting ticket:', err)
        });
      }
      // else: do nothing
    });
  }

  changeTicketStatus(ticket: any, newStatus: string) {
  if (ticket.status === newStatus) {
    console.warn('Ticket already has status:', newStatus);
    return;
  }

  if (newStatus === 'APPROVED') {
    if (ticket.status !== 'SOLVED') {
      console.error('Ticket must be SOLVED before it can be APPROVED.');
      return;
    }
    this.applicationService.approveTicket(ticket.id).subscribe({
      next: () => {
        ticket.status = 'APPROVED';
        console.log(`Ticket ${ticket.id} approved.`);
        this.getKPIs();
      },
      error: (err) => console.error('Error approving ticket:', err)
    });

  } else if (newStatus === 'CLOSED') {
    if (ticket.status !== 'APPROVED') {
      console.error('Ticket must be APPROVED before it can be CLOSED.');
      return;
    }
    this.applicationService.closeTicket(ticket.id).subscribe({
      next: () => {
        ticket.status = 'CLOSED';
        console.log(`Ticket ${ticket.id} closed.`);
        this.getKPIs();
      },
      error: (err) => console.error('Error closing ticket:', err)
    });

  } else {
    console.warn('User cannot manually change ticket to:', newStatus);
    // Do nothing; backend handles other status transitions automatically.
  }
}


  filterByState(state: string) {
    this.selectedStateFilter = state;
    this.getTicketsByUser();
    // totalTickets will be updated in getTicketsByUser
  }
  
  // input first and last name and capitalise the first name and  upper case lastname then return the concatenation of it example : SALIM Basma
}



