import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatMenuModule, MatButtonModule],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  role: string = '';
  firstname: string = '';
  lastname: string = '';
  email?: string = ''
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
  logout(){
    localStorage.clear();
    this.router.navigate([''])
    // this.keycloak.logout();
  }
}



