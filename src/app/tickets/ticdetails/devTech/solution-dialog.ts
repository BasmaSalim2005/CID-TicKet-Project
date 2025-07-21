import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';

@Component({
  selector: 'app-solution-dialog',
  templateUrl: './solution-dialog.html',
  styleUrls: ['./solution-dialog.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
]
})
export class SolutionDialog {
  solutionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SolutionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.solutionForm = this.fb.group({
      solution: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.solutionForm.valid) {
      this.dialogRef.close(this.solutionForm.value.solution);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
