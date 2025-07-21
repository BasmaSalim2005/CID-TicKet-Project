import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'edit-app-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-app-dialog.html',
  styleUrls: ['./edit-app-dialog.css']
})
export class EditAppDialog {
  appForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAppDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.appForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      description: [data.description, [Validators.required, Validators.minLength(10)]],
      gitLabLink: [data.gitLabLink, Validators.required],
      taigaLink: [data.taigaLink, Validators.required],
      logoLink: [data.logoLink]
    });
  }

  onSave() {
    if (this.appForm.valid) {
      this.dialogRef.close(this.appForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
