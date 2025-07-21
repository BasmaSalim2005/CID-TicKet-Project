import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../services/application-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditAppDialog } from 'src/app/applications/edit-app-dialog/edit-app-dialog';
import { TicketStatusDetailsDTO } from 'src/app/services/model/TicStatusDetailaDTO';

@Component({
  selector: 'app-ticket-details',
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
  templateUrl: 'ticket-details.html',
  styleUrls: ['ticket-details.css']
})
export class TicketDetails implements OnInit {
  ticket: any = null;
  editMode = false;
  readonlyMode = false; // add this
  ticketForm!: FormGroup;
  sidebarCollapsed: boolean = false;
  issolved: boolean = false;
  isapproved: boolean = false;
  isAdmin = false; // Set this based on your auth logic

   ticketDetails!: TicketStatusDetailsDTO; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.applicationService.getTicketById(+id).subscribe(ticket => {
        console.log(ticket)
        this.ticket = ticket;
        // If user is dev/tech, set readonlyMode = true
        // You can set this based on user role or route param
        // For now, assume readonlyMode is set externally
        this.ticketForm = this.fb.group({
          title: [ticket.title, [Validators.required, Validators.minLength(5)]],
          description: [ticket.description, [Validators.required, Validators.minLength(10)]],
          importance: [ticket.importance, Validators.required]
        });
        if (this.readonlyMode) {
          this.ticketForm.disable();
        }
        if(this.ticket.solution){
          this.issolved =true;
        }
        if(this.ticket.status ==='APRROVED'){
          this.isapproved = true;
        }
      });
    }
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.applicationService.getStatusDetails(+ticketId).subscribe({
        next: (data: TicketStatusDetailsDTO) => {
          this.ticketDetails = data;
          console.log('Loaded ticket details:', this.ticketDetails);
        },
        error: err => {
          console.error('Error fetching ticket details:', err);
        }
      });
    }
  
    // Example: set isAdmin based on user role (replace with real logic)
    // this.isAdmin = this.authService.isAdmin();
    this.isAdmin = true; // For testing, set to true for admin, false otherwise
  }

  enableEdit() {
    if (!this.readonlyMode) {
      this.editMode = true;
      this.ticketForm.enable();
    }
  }

  saveEdit() {
    if (this.ticketForm.valid) {
      this.applicationService.editTicket(this.ticket.id, this.ticketForm.value).subscribe(() => {
        this.editMode = false;
        Object.assign(this.ticket, this.ticketForm.value);
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.ticketForm.patchValue({
      title: this.ticket.title,
      description: this.ticket.description,
      importance: this.ticket.importance
    });
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateToApplication() {
    this.router.navigate(['/applications/apps']);
  }

  navigateToFeature() {
    this.router.navigate(['/features/features']);
  }

  navigateToTicket() {
    this.router.navigate(['/tickets/tickets']);
  }

  navigateToFeedback() {
    this.router.navigate(['/feedback/appfeedback']);
  }

  closeTic() {
    if (this.ticket.status ==='APPROVED') {
      this.applicationService.closeTicket(this.ticket.id).subscribe(() => {
        this.editMode = false;
        
      });
    }
  }

  ApproveTic() {
    if (this.ticket.status ==='SOLVED') {
      this.applicationService.approveTicket(this.ticket.id).subscribe(() => {
        this.editMode = false;
      });
    }
  }

  NotApproveTic() {
    if (this.ticket.status ==='SOLVED') {
      this.applicationService.notapproveTicket(this.ticket.id).subscribe(() => {
        this.editMode = false;
        
      });
    }
  }

  cancelTic() {
    if (this.ticket.status ==='ASSIGNED'|| this.ticket.status ==='INPROGRESS') {
      this.applicationService.cancelTicket(this.ticket.id).subscribe(() => {
        this.editMode = false;
        
      });
    }
  }


}
