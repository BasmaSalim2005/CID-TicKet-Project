import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'edit-feature-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit-feature-dialog.html',
  styleUrls: ['./edit-feature-dialog.css']
})
export class EditFeatureDialog {
  featureForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditFeatureDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.featureForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(3)]],
      description: [data.description, [Validators.required, Validators.minLength(10)]],
    });
  }

  onSave() {
    if (this.featureForm.valid) {
      this.dialogRef.close(this.featureForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
