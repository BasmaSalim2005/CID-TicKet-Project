import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from 'src/app/components/header';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar';

@Component({
  selector: 'app-ratingdialogue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './ratingdialogue.html',
  styleUrls: ['./ratingdialogue.css']
})
export class Ratingdialogue {
  constructor(
    public dialogRef: MatDialogRef<Ratingdialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
