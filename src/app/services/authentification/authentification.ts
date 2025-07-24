import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup  } from '@angular/forms';
import { ApplicationService } from '../application-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css'
})
export class Authentification {
    constructor(private formbuilder:FormBuilder, private applicationservice:ApplicationService, private router: Router){}
  appform!: FormGroup;
  loggedIn: boolean = false;
  ngOnInit(): void {
    this.appform = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18)]]
    })
  }
  authentificate(){
    alert('you logged in !')
    console.log('this is the loggin user:', this.appform.value)
    const email = this.appform.value.email;
    const password = this.appform.value.password;
    if (this.appform.invalid) return;
    this.applicationservice.AuthentificateUser(email, password).subscribe({
      next: (data) => {
        console.log('user logged succesfully', data);
        localStorage.setItem('user', JSON.stringify(data)); // <-- Save user to localStorage
        // if (data.role == 'DEVELOPER'){
        //   this.router.navigate(['/applications/apps']);
        // }else if (data.role =='ADMIN'){
        //   this.router.navigate(['/applications/appsadmin']);
        // }
        this.router.navigate(['/tickets']);
      },
      error: (error: any) =>{
        console.error('error while loggin user!', error)
      }
    });
  }
  
}
