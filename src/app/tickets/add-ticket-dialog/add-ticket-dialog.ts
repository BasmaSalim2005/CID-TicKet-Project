import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ApplicationService } from 'src/app/services/application-service';

@Component({
  selector: 'add-ticket-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule],
  templateUrl: './add-ticket-dialog.html',
  styleUrls: ['./add-ticket-dialog.css']
})
export class AddTicketDialog implements OnInit {
  ticketForm!: FormGroup;
  applications: any[] = [];
  features: any[] = [];
  showLocation: boolean = false;
  showApplications: boolean = false;
  showFeatures: boolean = false;

  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private applicationService:ApplicationService
  ) {}
  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    this.email = JSON.parse(userStr|| '').email;
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      categories: ['', Validators.required],
      priority: ['', Validators.required],
      location: [''],
      app: [''],
      feature: [''],
      createdBy: [this.email]
    });

    this.ticketForm.get('categories')?.valueChanges.subscribe((cat) => {
      this.showLocation = false;
      this.showApplications = false;
      this.showFeatures = false;
      this.ticketForm.get('location')?.setValidators(null);
      this.ticketForm.get('app')?.setValidators(null);
      this.ticketForm.get('feature')?.setValidators(null);
      this.ticketForm.get('location')?.updateValueAndValidity();
      this.ticketForm.get('app')?.updateValueAndValidity();
      this.ticketForm.get('feature')?.updateValueAndValidity();
      if (cat === 'HELPDESK') {
        this.showLocation = true;
        this.ticketForm.get('location')?.setValidators([Validators.required]);
        this.ticketForm.get('location')?.updateValueAndValidity();
      } else if (cat === 'APP_RELATED') {
        this.showApplications = true;
        this.applicationService.getAllApplications().subscribe(apps => {
          this.applications = apps;
        });
        this.ticketForm.get('app')?.setValidators([Validators.required]);
        this.ticketForm.get('app')?.updateValueAndValidity();
      }
    });

    this.ticketForm.get('app')?.valueChanges.subscribe((appName) => {
      this.showFeatures = false;
      this.features = [];
      this.ticketForm.get('feature')?.setValidators(null);
      this.ticketForm.get('feature')?.updateValueAndValidity();
      if (appName) {
        this.showFeatures = true;
        this.applicationService.getFeaturesByAppName(appName).subscribe(feats => {
          this.features = feats;
        });
        this.ticketForm.get('feature')?.setValidators([Validators.required]);
        this.ticketForm.get('feature')?.updateValueAndValidity();
      }
    });
  }

  onSave() {
    
      console.log('form values:', this.ticketForm.value)
    if (this.ticketForm.valid) {
      console.log('form values:', this.ticketForm.value)
      this.dialogRef.close(this.ticketForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
  
}
