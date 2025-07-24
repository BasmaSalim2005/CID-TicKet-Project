import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../../services/application-service';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
// import { SolutionDialog } from './solution-dialog';

@Component({
  selector: 'app-ticket-details-devtech',
  templateUrl: 'ticket-details-devtech.html',
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
  styleUrls: ['ticket-details-devtech.css']
})
export class TicketDetailsDevTech implements OnInit {
  ticket: any = null;
  solutionForm!: FormGroup;
  solutionSubmitted = false;
  sidebarCollapsed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.applicationService.getTicketById(+id).subscribe(ticket => {
        this.ticket = ticket;
        this.solutionForm = this.fb.group({
          solution: ['', Validators.required]
        });
        // If status is 'assigned', mark as 'in-progress'
        if (ticket.status === 'assigned') {
          this.applicationService.inProgressStatus(ticket.id).subscribe(() => {
            this.ticket.status = 'in-progress';
          });
        }
      });
    }
  }
  addSolution(sol: string) {
    // const dialogRef = this.dialog.open(SolutionDialog, {
    //   width: '400px',
    //   data: { ticketId: ticket.id }
    // });

    // dialogRef.afterClosed().subscribe(result => {
      // console.log(result)
      // if (result && result.solution) {
        this.applicationService.solveTicket(this.ticket.id, sol).subscribe(() => {
          this.ticket.solution = sol;
          this.ticket.status = 'solution-submitted';
        });
      }
    
  
  submitSolution() {
    if (this.solutionForm.valid && this.ticket) {
      this.applicationService.solveTicket(this.ticket.id, this.solutionForm.value.solution)
        .subscribe((updatedTicket: any) => {
          if (this.ticket && updatedTicket) {
            this.ticket.solution = updatedTicket.solution;
            this.ticket.status = updatedTicket.status || 'solution-submitted';
            this.ticket.solvedAt = updatedTicket.solvedAt;
            this.solutionSubmitted = true;
          }
        });
    }
  }
    toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  closeTicket(ticket: any) {
    if (ticket.status === 'APPROVED') {
      this.applicationService.closeTicket(ticket.id).subscribe(() => {
        ticket.status = 'CLOSED';
      });
    }
  }
  
}
