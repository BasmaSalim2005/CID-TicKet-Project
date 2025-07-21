

import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, CommonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  role: string = '';
  firstname: string = '';
  lastname: string = '';
  email?: string = ''
  showProfileMenu: boolean = false;
  constructor(private router: Router) {}
  
  @Output() toggleSidebar = new EventEmitter<void>();

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Loaded user from localStorage:', user); // <-- Add this line
    // const user = this.keycloak.userProfile;
    this.role = user.role;
    this.firstname = user.firstname || '';
    this.lastname = user.lastname || '';
    this.email = user.email;
}
  getInitials(): string {
  const first = this.firstname ? this.firstname[0].toUpperCase() : '';
  const last = this.lastname ? this.lastname[0].toUpperCase() : '';
  return first + last;
  }
  get initials(): string {
    return this.getInitials();
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Only close if click is outside the initials or dropdown
    if (!target.closest('.account-info')) {
      this.showProfileMenu = false;
    }
  }
  capitalizeText(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
 formatRole(text: string): string {
  if( this.role ==='ADMIN'){
    return 'Administrator'
  }
  if( this.role ==='DEVELOPER'){
    return 'Développeur'
  }
  if( this.role ==='TECHNICIAN'){
    return 'Technicien'
  } else  {
    return 'Utilisateur'
  }
}


  logout(){
    localStorage.clear();
    this.router.navigate([''])
    this.showProfileMenu = false;
    // this.keycloak.logout();
  }
}



