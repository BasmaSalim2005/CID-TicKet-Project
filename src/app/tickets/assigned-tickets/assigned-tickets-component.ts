import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-assigned-tickets',
  templateUrl: './assigned-tickets.component.html',
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
  styleUrls: ['./assigned-tickets.component.css']
})
export class AssignedTicketsComponent implements OnInit {
  assignedTickets: any[] = [];
  loading = false;

  constructor(
    private appService: ApplicationService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.appService.getAssignedTickets().subscribe(tickets => {
      this.assignedTickets = tickets;
      this.loading = false;
    });
  }

  openTicket(ticket: any) {
    if (ticket.status === 'assigned') {
      this.appService.updateTicketStatus(ticket.id, 'in-progress').subscribe(() => {
        ticket.status = 'in-progress';
        this.router.navigate(['/tickets/details', ticket.id]);
      });
    } else {
      this.router.navigate(['/tickets/details', ticket.id]);
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
}

// SolutionDialogComponent is a simple dialog for entering a solution
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-solution-dialog',
  template: 'assigned-tickets-component.html',
  styles: 'assigned-tickets-component.css'
})
export class SolutionDialogComponent {
  form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<SolutionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      solution: ['', Validators.required]
    });
  }
  onCancel() {
    this.dialogRef.close();
  }
  onConfirm() {
    this.dialogRef.close({ solution: this.form.value.solution });
  }
}
