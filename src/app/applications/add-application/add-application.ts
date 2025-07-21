import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-application',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './add-application.html',
  styleUrl: './add-application.css',
})
export class AddApplication implements OnInit {
  constructor(private formbuilder:FormBuilder, private applicationService:ApplicationService,
     public dialogRef: MatDialogRef<AddApplication>
     , private router: Router){}
  appform!: FormGroup;
  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/authentification']);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.appform = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      gitLabLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
      taigaLink: ['', [Validators.required, Validators.pattern(/^https:\/\/.*$/)]],
      logoLink: [''], // Optional
      devEmail: [user.email || '', Validators.required] // <-- Add this line
    })
  }
  closeDialog(sucess: boolean = false){
    this.dialogRef.close(sucess);
  }
  addApplications(){
    if (this.appform.invalid)return;
    console.log('Submitting:', this.appform.value); // Debug log
    this.applicationService.addApplications(this.appform.value).subscribe({
      next: (data) => {
        localStorage.setItem('app', JSON.stringify(data));
        console.log('Application added', data);
        this.appform.reset();
        this.dialogRef.close(true);
      },
      error: (error) =>{
        console.error('error while adding app!', error) // <-- Fix error message
      }
  })
}



}


