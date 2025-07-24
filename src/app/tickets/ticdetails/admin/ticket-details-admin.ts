import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../services/application-service';
import { TicketStatusDetailsDTO } from 'src/app/services/model/TicStatusDetailaDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ticket-details-admin',
  templateUrl: 'ticket-details-admin.html',
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
    MatIconModule

  ],
  styleUrls: ['ticket-details-admin.css']
})
export class TicketDetailsAdmin implements OnInit {
  ticket: any = null;
  ticketDetails!: TicketStatusDetailsDTO;
  sidebarCollapsed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.applicationService.getTicketById(+id).subscribe(ticket => {
        this.ticket = ticket;
      });
      this.applicationService.getStatusDetails(+id).subscribe({
        next: (data: TicketStatusDetailsDTO) => {
          console.log('data',data);
          this.ticketDetails = data;
        }
      });
    }
  }
 toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
}
