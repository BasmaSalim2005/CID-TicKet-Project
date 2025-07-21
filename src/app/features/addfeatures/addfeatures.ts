import { Component, Inject, Input, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-addfeatures',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './addfeatures.html',
  styleUrl: './addfeatures.css'
})
export class Addfeatures {
  featform!: FormGroup;
  application: any = {};
  @Inject(MAT_DIALOG_DATA) public appName?:string;

  constructor(
    private formbuilder: FormBuilder,
    private applicationService: ApplicationService,
    public dialogRef: MatDialogRef<Addfeatures>,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('appName:', this.appName)
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/authentification']);
      return;
    }
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.featform = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      appId: [, [Validators.required]], // will be set after fetching app
      devEmail: [user.email || '', Validators.required]
    });
  }

  getAppByName(name: string): void {
    this.applicationService.getAppByName(name).subscribe({
      next: (data: any) => {
        this.application = data;
        this.featform.patchValue({ appId: data.id }); // set appId after fetching app
      },
      error: (error: any) => {
        console.error('Error fetching app by name:', error);
      }
    });
  }

  closeDialog(success: boolean = false): void {
    this.dialogRef.close(success);
  }

  addfeatures(): void {
    console.log('feature form value:', this.featform.value);
    if (this.featform.invalid) return;
    console.log('Submitting:', this.featform.value);
    this.applicationService.addFeature(this.featform.value).subscribe({
      next: (data: any) => {
        console.log('Feature added', data);
        this.featform.reset();
        this.dialogRef.close(true);
      },
      error: (error: any) => {
        console.error('Error while adding feature!', error);
      }
    });
  }
}



