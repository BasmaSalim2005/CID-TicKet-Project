import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddApplication } from 'src/app/applications/add-application/add-application';
import { ApplicationService } from 'src/app/services/application-service';
import { Addfeedback } from '../add-feedback/addfeedback';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { App } from 'src/app/app';


@Component({
  selector: 'app-appfeedback',
  standalone: true,
  imports: [CommonModule,
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
  templateUrl: './appfeedback.html',
  styleUrl: './appfeedback.css'
})
export class Appfeedback implements OnInit{
  applications: any[] = [];
  appform!: FormGroup;


  sidebarCollapsed: boolean = false;
  role: string = '';


  // ✅ Pagination state
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;

  searchTerm: string = '';
   constructor(
    private applicationService: ApplicationService,
    private formbuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getAllApplications();
  }
  openrateAppDialog(app: any) {
      const dialogRef = this.dialog.open(Addfeedback, {
        width: '500px', // wider popup
        data: { appName: app.name, applicationId: app.id }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllApplications();
          
        }
      });
    }
  getAllApplications() {
    // Fetch all applications for the current page and filter
      this.applicationService.getAllApplicationspage(this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          console.log(data)
          this.applications = data.content;
          this.totalPages = data.totalPages;
          console.log(`Loaded page ${this.currentPage + 1} of ${this.totalPages}`);
        },
        error: (error) => {
          console.error('Error loading applications', error);
        }
      });
    }
    
  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.getAllApplications();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllApplications();
    }
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateToApplication() {
    this.router.navigate(['/applications/apps']);
  }

  navigateToAdminApplication() {
    this.router.navigate(['/applications/appsadmin']);
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
  navigateToFeatureApp(appName: string) {
    this.router.navigate(['/features/features'], { queryParams: { app: appName } });
  }
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

}
