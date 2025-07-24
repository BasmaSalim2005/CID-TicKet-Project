import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationService } from '../../services/application-service';
import { MatDialog } from '@angular/material/dialog';
import { Ratingdialogue } from '../ratingdialogue/ratingdialogue';
import { HeaderComponent } from 'src/app/components/header';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent],
  templateUrl: './summary.html',
  styleUrls: ['./summary.css']
})
export class Summary implements OnInit {
  appId: number = 0;
  appName: string = '';
  feedbacks: any[] = [];
  sidebarCollapsed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.appId = +params.get('id')!;
      this.route.queryParamMap.subscribe(queryParams => {
        this.appName = queryParams.get('name') || '';
        console.log('Summary page appId:', this.appId, 'appName:', this.appName);
        if (this.appId) {
          this.applicationService.getFeedbackByApp(this.appId).subscribe((data) => {
            console.log('Feedbacks received for appId', this.appId, ':', data);
            this.feedbacks = data;
          }, (err) => {
            console.error('Error fetching feedbacks for appId', this.appId, err);
          });
        }
      });
    });
  }

  openRatingDialog(feedback: any): void {
    this.dialog.open(Ratingdialogue, {
      width: '400px',
      data: feedback
    });
  }

    toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
    
