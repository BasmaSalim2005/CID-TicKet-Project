import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'add-developer-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './add-developer-dialog.html',
  styleUrls: ['./add-developer-dialog.css']
})
export class AddDeveloperDialog {
  devForm: FormGroup;
  developers: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddDeveloperDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.devForm = this.fb.group({
      email: ['', Validators.required]
    });
    this.developers = data.developers || [];
  }

  onSave() {
    if (this.devForm.valid) {
      this.dialogRef.close(this.devForm.value.email);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
