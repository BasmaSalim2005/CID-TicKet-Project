import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { ApplicationService } from 'src/app/services/application-service';

@Component({
  selector: 'add-ticket-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule,MatOptionModule],
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

  constructor(
    public dialogRef: MatDialogRef<AddTicketDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private applicationService:ApplicationService
  ) {}
  ngOnInit(): void {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      location: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      priority: ['', Validators.required],
      app: ['', Validators.required],
      feature: ['', Validators.required],
    });
  }

  onSave() {
    if (this.ticketForm.valid) {
      this.dialogRef.close(this.ticketForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
  
}
