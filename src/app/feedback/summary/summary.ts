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
      this.appName = params.get('name') || '';
      if (this.appName) {
        this.applicationService.getFeedbackByApp(this.appName).subscribe((feedbacks: any[]) => {
          this.feedbacks = feedbacks;
        });
      }
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
    
