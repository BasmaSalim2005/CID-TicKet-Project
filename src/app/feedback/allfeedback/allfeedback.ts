import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-allfeedback',
  standalone: true,
  imports: [CommonModule, MatCardModule, HeaderComponent, SidebarComponent, MatIconModule],
  templateUrl: './allfeedback.html',
  styleUrls: ['./allfeedback.css']
})
export class Allfeedback implements OnInit {
  applications: any[] = [];
  sidebarCollapsed = false;

  constructor(private applicationService: ApplicationService, private router: Router) {}

  ngOnInit(): void {
    this.applicationService.getAllApplications().subscribe((apps: any[]) => {
      console.log('apps from allfeed:', apps);
      this.applications = apps;
      // For each app, fetch its feedbacks and set ratingCount and overallRating
      this.applications.forEach(app => {
        this.applicationService.getFeedbackByApp(app.id).subscribe((feedbacks: any[]) => {
          console.log('Feedbacks for app', app.id, feedbacks);
          app.ratingCount = Array.isArray(feedbacks) ? feedbacks.length : 0;
          if (Array.isArray(feedbacks) && feedbacks.length > 0) {
            // Use the 'overall' field from each feedback, as in summary page
            const ratings = feedbacks.map(fb => {
              if (typeof fb.overall === 'number') return fb.overall;
              if (typeof fb.overall === 'string') return Number(fb.overall);
              return 0;
            });
            app.overallRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 100) / 100;
          } else {
            app.overallRating = 0;
          }
        });
      });
    });
  }

  goToSummary(app: any): void {
    this.router.navigate(['/feedback/summary', app.id], { queryParams: { name: app.name } });
  }
    toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
 
}
