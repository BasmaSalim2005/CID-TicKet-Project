import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../services/application-service';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class History implements OnInit {
  closedTickets: any[] = [];
  sidebarCollapsed = false;

  constructor(private applicationService: ApplicationService, private router: Router) {}

  ngOnInit(): void {
    this.applicationService.getTicketsByUser(/* add user email or logic here if needed */ '').subscribe((tickets: any[]) => {
      this.closedTickets = (tickets || []).filter(tic => tic.status?.toLowerCase() === 'closed');
    });
  }

  goToTicketDetails(ticket: any): void {
    this.router.navigate(['/tickets/ticdetails/admin', ticket.id]);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
