import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RoleAuthGuard } from '../../services/role-auth.guard';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  imports: [MatIconModule, CommonModule],
  standalone: true,
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit{
  @Input() sidebarCollapsed = false;
  @Output() applicationNav = new EventEmitter<void>();
  @Output() adminApplicationNav = new EventEmitter<void>();
  @Output() featureNav = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() ticketNav = new EventEmitter<void>();
  @Output() feedbackNav = new EventEmitter<void>();
  @Output() assignedNav = new EventEmitter<void>();


  role: string = '';
  
  constructor(private router: Router, private authGuard: RoleAuthGuard) {}
  
  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.role || '';
    console.log('Current user role:', this.role);
  }
  togglesidebar(){
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.toggleSidebar.emit();
  }
  // Helper method to check if user has the required roles
  private hasRole(requiredRoles: string[]): boolean {
    return requiredRoles.includes(this.role);
  }

  navigateToAllApplications() {
    // Assuming this should navigate to the admin applications view
    if (this.hasRole(['ADMIN'])) {
      this.router.navigate(['/applications/appsadmin']);
    } else {
      // Redirect to not authorized or default page
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToApplication() {
    if (this.hasRole(['ADMIN'])) {
      this.router.navigate(['/applications/appsadmin']);
    } else if (this.hasRole(['USER', 'DEV', 'TECH'])) {
      this.router.navigate(['/applications/apps']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToFeature() {
    if (this.hasRole(['ADMIN'])) {
      this.router.navigate(['/features/admin']);
    } else if (this.hasRole(['USER', 'DEV', 'TECH'])) {
      this.router.navigate(['/features']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToTicket() {
    if (this.hasRole(['ADMIN'])) {
      this.router.navigate(['/tickets/admintic']);
    } else if (this.hasRole(['DEV', 'TECH'])) {
      this.router.navigate(['/tickets/assignedticketscomponent']);
    } else if (this.hasRole(['USER'])) {
      this.router.navigate(['/tickets']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToFeedback() {
    if (this.hasRole(['ADMIN'])) {
      this.router.navigate(['/feedback/allfeedback']);
    } else if (this.hasRole(['USER', 'DEV', 'TECH'])) {
      this.router.navigate(['/feedback/appfeedback']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToAssigned() {
    if (this.hasRole(['DEV', 'TECH'])) {
      this.router.navigate(['/tickets/assignedticketscomponent']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToHistory() {
    // All authenticated users can view history
    if (this.hasRole(['USER', 'DEV', 'TECH', 'ADMIN'])) {
      this.router.navigate(['/tickets/history']);
    } else {
      this.router.navigate(['/not-authorized']);
    }
  }

  navigateToProfile() {
    // Assuming all authenticated users can access their profile
    this.router.navigate(['/profile']);
  }
}
