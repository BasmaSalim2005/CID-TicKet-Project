import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
   imports: [MatIconModule],
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
  ngOnInit(): void{
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user.role || '';
    console.log(this.role)
    }

  constructor(private router:Router){}
  togglesidebar(){
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.toggleSidebar.emit();
  }
  navigateToApplication() {
    if (this.role === 'ADMIN') {
      console.log('navigating to apps for admin')
      // this.adminApplicationNav.emit();
      this.router.navigate(['/applications/appsadmin'])
    } else {
      // this.applicationNav.emit();
      console.log('navigating to apps for normal user')
      this.router.navigate(['/applications/apps'])
      
    }
  }
  navigateToFeature() {
    this.featureNav.emit();
  }
  navigateToTicket() {
    this.ticketNav.emit();
  }
  navigateToFeedback(){
    if (this.role != 'ADMIN') {
       this.feedbackNav.emit();
    }
  }
  navigateToAssigned() {
      console.log('navigating to assigned')
      this.router.navigate(['/tickets/assignedticketscomponent']);
  }
}
