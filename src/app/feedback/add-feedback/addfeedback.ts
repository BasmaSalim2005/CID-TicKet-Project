import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route, Router } from '@angular/router';
import { ApplicationService } from 'src/app/services/application-service';

@Component({
  selector: 'app-addfeedback',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './addfeedback.html',
  styleUrl: './addfeedback.css'
})
export class Addfeedback {
 
  feedbackForm!: FormGroup;
  constructor(private formbuilder:FormBuilder, private applicationService:ApplicationService,
     public dialogRef: MatDialogRef<Addfeedback>
     , private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')||'');
    this.feedbackForm = this.formbuilder.group({
      usability: [0, Validators.required],
      satisfaction: [0, Validators.required],
      performance: [0, Validators.required],
      design: [0, Validators.required],
      reliability: [0, Validators.required],
      comment: ['', Validators.required],  // comment is obligatory
      applicationId: [],
      appName: [],
      userEmail:[user.email || '', Validators.required]
    });
  }

  closeDialog(sucess: boolean = false){
    this.dialogRef.close(sucess);
  }

  setRating(field: string, rating: number): void {
    this.feedbackForm.get(field)?.setValue(rating);
  }

  submit(): void {
    if (this.feedbackForm.valid) {
      console.log(this.feedbackForm.value);
      this.applicationService.addFeedback(this.feedbackForm.value).subscribe({
        next: (data) => {
          this.dialogRef.close(true);
          console.log(data);
        }
      })
      // Call your service here to send feedback to your backend
    } else {
      alert('Please add a comment before submitting!');
    }
  }
}



