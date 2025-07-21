import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-allfeedback',
  standalone: true,
  imports: [CommonModule, MatCardModule, HeaderComponent, SidebarComponent],
  templateUrl: './allfeedback.html',
  styleUrls: ['./allfeedback.css']
})
export class Allfeedback implements OnInit {
  applications: any[] = [];
  sidebarCollapsed = false;

  constructor(private applicationService: ApplicationService, private router: Router) {}

  ngOnInit(): void {
    this.applicationService.getAllApplications().subscribe((apps: any[]) => {
      this.applications = apps;
    });
  }

  goToSummary(app: any): void {
    this.router.navigate(['/feedback/summary', app.name]);
  }
    toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
 
}
