import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../components/header';
import { SidebarComponent } from '../components/sidebar/sidebar';
import { ApplicationService } from '../services/application-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Addfeatures } from './addfeatures/addfeatures'
import { MatDialog } from '@angular/material/dialog';
import { EditFeatureDialog } from './edit-feature-dialog/edit-feature-dialog';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-features',
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
    EditFeatureDialog
  ],
  templateUrl: './features.html',
  styleUrl: './features.css'
})
export class Features implements OnInit {
  features: any[] = [];
  appName: string = '';
  sidebarCollapsed: boolean = false;
  appNames: string[] = []; // List of all app names

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/authentification']);
      return;
    }
    // Fetch all app names for the dropdown
    this.applicationService.getAllApplications().subscribe((apps: any[]) => {
      this.appNames = apps.map(app => app.name);
    });

    this.route.queryParams.subscribe(params => {
      this.appName = params['app'] || '';
      if (this.appName) {
        this.getFeatureByApp(this.appName);
      } else {
        this.features = [];
      }
    });
  }
  openAddAppDialog(appName:string) {
    
    console.log('appname from opem dailogue:',this.appName)
      const dialogRef = this.dialog.open(Addfeatures, {
        width: '450px',
        data: this.appName
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFeatureByApp(this.appName);
          
        }
      });
    }

  onAppSelected(appName: string) {
    this.appName = appName;
    this.getFeatureByApp(appName);
  }

 capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

  getFeatureByApp(appName: string) {
    this.applicationService.getFeaturesByAppName(appName).subscribe({
      next: (data) => {
        console.log('Feature data:', data); // <-- Add this line
        this.features = data;
      },
      error: (error: any) => {
        this.features = [];
      }
    });
  }
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  navigateToApplication() {
    this.router.navigate(['/application/apps']);
  }
  navigateToAdminApplication() {
    this.router.navigate(['/application/appsadmin']);
  }
  navigateToFeature() {
    this.router.navigate(['/features/features']);
  }
  navigateToTicket() {
    this.router.navigate(['tickets/tickets']);
  }

  navigateToFeedback() {
    this.router.navigate(['/feedback/appfeedback']);
  }

  formatDev(firstname:string, lastname:string): string{
    if(firstname!= null){
    const fname = firstname.charAt(0).toUpperCase()+firstname.slice(1).toLowerCase();
    const lname = lastname.toUpperCase();
    return `${lname} ${fname}`;
    }
    return'';
  }
  editFeature(featureId: number, feature: any) {
    if (featureId === undefined || featureId === null) {
      // Try to recover the id from the feature object if possible
      if (feature && feature.id !== undefined && feature.id !== null) {
        featureId = feature.id;
      } else {
        console.error('Cannot edit feature: featureId is undefined or null!', feature);
        alert('Error: Feature ID is missing. Cannot edit this feature.');
        return;
      }
    }
    const dialogRef = this.dialog.open(EditFeatureDialog, {
      width: '450px',
      data: { ...feature, id: featureId } // Pass id explicitly
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Always send the id for update
        this.applicationService.editFeature(featureId, { ...result, id: featureId }).subscribe({
          next: () => this.getFeatureByApp(this.appName),
          error: err => console.error('Error updating feature:', err)
        });
      }
    });
  }

  deleteFeature(featureId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this feature?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.applicationService.deleteFeature(featureId).subscribe({
          next: () => this.getFeatureByApp(this.appName),
          error: err => console.error('Error deleting feature:', err)
        });
      }
      // else: do nothing
    });
  }
  
  // input first and last name and capitalise the first name and  upper case lastname then return the concatenation of it example : SALIM Basma
}
