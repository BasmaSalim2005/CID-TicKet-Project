import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../components/header';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { MatDialog } from '@angular/material/dialog';
import { AddApplication } from '../../applications/add-application/add-application';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-apps',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    SidebarComponent,
    HeaderComponent,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './apps.html',
  styleUrl: './apps.css'
})
export class Apps implements OnInit{
  applications: any[] = [];
  appform!: FormGroup;
  totalDisactive: number =0;
  totalActive: number =0;
  totalMaintenance: number =0;
  totalApps: number = 0;
  sidebarCollapsed = false;

  email: string = ""

  selectedStateFilter: string = 'ALL';

  // ✅ Pagination state
  currentPage: number = 0;
  pageSize: number = 8;
  totalPages: number = 0;

  searchTerm: string = '';

  constructor(
    private applicationService:ApplicationService, 
    private formbuilder:FormBuilder,
    private router: Router,
    private dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.email  = JSON.parse(localStorage.getItem('user') || '').email;
    // alert('email used :'+ this.email)
    this.getAllAppsByUser(this.email);
    // this.appform = this.formbuilder.group({
    //   name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
    //   description: ['', [Validators.required, Validators.minLength(10)]],
    //   gitLabLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
    //   taigaLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
    //   logoLink: [''], // Optional
    //   devEmail: [this.email]
    // });
    this.getAppKPIs();
  }
   getAppKPIs(){
      this.applicationService.totalAppsDisactiveUser(this.email).subscribe(data => {
        this.totalDisactive = data;
      });
      this.applicationService.totalAppsActiveUser(this.email).subscribe(data => {
        this.totalActive = data;
      });
      this.applicationService.totalAppsMaintenanceUser(this.email).subscribe(data => {
        this.totalMaintenance = data;
      });
      this.applicationService.totalAppsUser(this.email).subscribe(data =>{
        this.totalApps = data;
      })
    }

  // addApplications(){
  //   console.log('Adding app with value:', this.appform.value)
  //   alert('you added an app')
  //   // if (this.appform.invalid) return;
  //   this.applicationService.addApplications(this.appform.value).subscribe({
  //     next: (data) => {
  //       console.log('Application added', data);
  //       this.appform.reset();
  //       this.getAllAppsByUser(this.email);
  //       this.getAppKPIs();
  //     },
  //     error: (error) =>{
  //       console.error('error while adding app!', error)
  //     }
  //   })
  // }

  getAllAppsByUser(email: string) {
    if (this.selectedStateFilter === 'ALL') {
      this.applicationService.getAppbyuserpage(email, this.currentPage, this.pageSize).subscribe({
        next: (data) => {
          this.applications = data.content;
          this.totalPages = data.totalPages;
        }
      });
    // } else {
    //   // If your backend supports filtering by state with pagination, use that here.
    //   this.applicationService.getAppbyuserStatePage(email, this.selectedStateFilter, this.currentPage, this.pageSize).subscribe({
    //     next: (data) => {
    //       this.applications = data.content;
    //       this.totalPages = data.totalPages;
    //     }
    //   });
    // }
  }}

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
          next: () => this.getAllAppsByUser(this.email),
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
    this.router.navigate(['/application/apps']);
  }
  // openAddAppDialog() {
  //   const email = this.email;
  //   const dialogRef = this.dialog.open(AddApplication, {
  //     width: '450px',
  //     data: { devEmail: email }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.getAllAppsByUser(this.email);
  //       this.getAppKPIs();
  //     }
  //   });
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
        console.log('this is app name i am using:', app.name);
        this.getAppKPIs();
      },
      error: (error) => {
        console.error('Error updating app state:', error);
      }
    });
  }

  // Sidebar navigation (keep as is)
  navigateToFeature() {
    this.router.navigate(['/features/features']);
  }

  // App name click navigation
  navigateToFeatureApp(appName: string) {
    this.router.navigate(['/features/features'], { queryParams: { app: appName } });
  }

  navigateToTicket() {
    this.router.navigate(['/tickets/tickets']);
  }

  navigateToFeedback() {
    this.router.navigate(['/feedback/appfeedback']);
  }

  filterByState(state: string) {
    this.selectedStateFilter = state;
    this.currentPage = 0;
    this.getAllAppsByUser(this.email);
  }

  searchApplications(term: string) {
    this.searchTerm = term.trim().toLowerCase();
  }

  get filteredApplications() {
    // Filter by search term as well as state
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
      this.getAllAppsByUser(this.email);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllAppsByUser(this.email);
    }
  }
  }






