import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../services/application-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

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

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private fb: FormBuilder
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
          this.applicationService.updateTicketStatus(ticket.id, 'in-progress').subscribe(() => {
            this.ticket.status = 'in-progress';
          });
        }
      });
    }
  }
  addSolution(ticket: any) {
    const dialogRef = this.dialog.open(SolutionDialogComponent, {
      width: '400px',
      data: { ticketId: ticket.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.solution) {
        this.appService.solveTicket(ticket.id, result.solution).subscribe(() => {
          ticket.solution = result.solution;
          ticket.status = 'solution-submitted';
        });
      }
    });
  }
  submitSolution() {
    if (this.solutionForm.valid) {
      this.applicationService.solveTicket(this.ticket.id, this.solutionForm.value.solution)
        .subscribe(() => {
          this.ticket.solution = this.solutionForm.value.solution;
          this.ticket.status = 'solution-submitted';
          this.solutionSubmitted = true;
        });
    }
  }
}
