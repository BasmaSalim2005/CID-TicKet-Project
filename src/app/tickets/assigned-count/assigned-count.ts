
import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AddTicketDialog } from '../add-ticket-dialog/add-ticket-dialog';

@Component({
  selector: 'app-assigned-count',
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
  templateUrl: './assigned-count.html',
  styleUrls: ['./assigned-count.css']
})
export class AssignedCount implements OnInit {
  assignedCounts: { name: string; email: string; count: number; inprogress: number }[] = [];
  loading = true;
  error = '';
  sidebarCollapsed : boolean= false;

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.appService.getAssignedCountByDev().subscribe({
      next: (data) => {
        console.log(data)
        this.assignedCounts = (data || [])
          .map((item: any) => ({
            name: item.fullname,
            email: item.email,
            count: item.ticketCount,
            inprogress: item.inprogress || 0
          }))
          .sort((a: { count: number }, b: { count: number }) => b.count - a.count);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load assigned counts.';
        this.loading = false;
      }
    });
  }

  onToggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
