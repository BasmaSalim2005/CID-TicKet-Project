import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { AddApplication } from '../add-application/add-application';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EditAppDialog } from '../edit-app-dialog/edit-app-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AddDeveloperDialog } from '../add-developer-dialog/add-developer-dialog';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-apps-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    EditAppDialog
  ],
  templateUrl: './apps-admin.html',
  styleUrls: ['./apps-admin.css']
})
export class AppsAdmin implements OnInit {
  applications: any[] = [];
  appform!: FormGroup;

  totalDisactive: number = 0;
  totalActive: number = 0;
  totalMaintenance: number = 0;
  totalApps: number = 0;

  sidebarCollapsed: boolean = false;
  role: string = '';

  selectedStateFilter: string = 'ALL';

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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.role || '';

    this.getAllApplications();
    this.getAppKPIs();

    // this.appform = this.formbuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    //   description: ['', [Validators.required, Validators.minLength(10)]],
    //   gitLabLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
    //   taigaLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
    //   logoLink: ['']
    // });
  }

  getAllApplications() {
    // Fetch all applications for the current page and filter
    if (this.selectedStateFilter === 'ALL') {
      this.applicationService.getAllApplicationspage(this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.applications = data.content;
          this.totalPages = data.totalPages;
          console.log(`Loaded page ${this.currentPage + 1} of ${this.totalPages}`);
        },
        error: (error) => {
          console.error('Error loading applications', error);
        }
      });
    } 
  }

  getAppKPIs() {
    this.applicationService.totalAppsDisactive().subscribe(data => {
      this.totalDisactive = data;
    });
    this.applicationService.totalAppsActive().subscribe(data => {
      this.totalActive = data;
    });
    this.applicationService.totalAppsMaintenance().subscribe(data => {
      this.totalMaintenance = data;
    });
    this.applicationService.totalApps().subscribe(data => {
      this.totalApps = data;
    });
  }

  

  deleteApplication(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this application?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.applicationService.deleteApplication(id).subscribe({
          next: () => this.getAllApplications(),
          error: err => console.error('Error deleting application:', err)
        });
      }
      // else: do nothing
    });
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

  openAddAppDialog() {
    const dialogRef = this.dialog.open(AddApplication, {
      width: '600px', // wider popup
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllApplications();
        this.getAppKPIs();
      }
    });
  }

  editApplication(app: any) {
    const dialogRef = this.dialog.open(EditAppDialog, {
      width: '600px', // wider popup
      data: { ...app }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.applicationService.editApplication(app.id, result).subscribe({
          next: () => {this.getAllApplications(), this.getAppKPIs()},
          error: err => console.error('Error updating app:', err)
        });
      }
    });
  }

  // Add developer to app
  openAddDeveloperDialog(app: any) {
    this.applicationService.getAllDevelopers().subscribe({
      next: (developers) => {
        const dialogRef = this.dialog.open(AddDeveloperDialog, {
          width: '400px',
          data: { app, developers }
        });
        dialogRef.afterClosed().subscribe(email => {
          if (email) {
            this.applicationService.addUserToApp(email, app.name).subscribe({
              next: () => {
                // Optionally show a success message or refresh data
                this.getAllApplications();
              },
              error: err => {
                // Optionally show an error message
                console.error('Error adding developer:', err);
              }
            });
          }
        });
      },
      error: err => {
        console.error('Error fetching developers:', err);
      }
    });
  }

  changeAppState(app: any, newState: string) {
    if (app.state === newState) return;

    let stateObservable;
    if (newState === 'ACTIVE') {
      stateObservable = this.applicationService.setApplicationActive(app.name);
    } else if (newState === 'DISACTIVE') {
      stateObservable = this.applicationService.setApplicationDisactive(app.name);
    } else if (newState === 'INMAINTENANCE') {
      stateObservable = this.applicationService.setApplicationMaintenance(app.name);
    } else {
      return;
    }

    stateObservable.subscribe({
      next: () => {
        app.state = newState;
        console.log('Updated app state:', app.name);
        this.getAppKPIs();
      },
      error: (error) => {
        console.error('Error updating app state:', error);
      }
    });
  }

  filterByState(state: string) {
    this.selectedStateFilter = state;
    this.currentPage = 0;
    this.getAllApplications();
  }

  searchApplications(term: string) {
    this.searchTerm = term.trim().toLowerCase();
  }

  get filteredApplications() {
    let apps = this.applications;
    if (this.searchTerm) {
      apps = apps.filter(app =>
        (app.name && app.name.toLowerCase().includes(this.searchTerm)) ||
        (app.description && app.description.toLowerCase().includes(this.searchTerm))
      );
    }
    return apps;
  }

  // ✅ Pagination handlers
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

  
}



