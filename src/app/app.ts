import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
   protected title = 'ticket-app';
  // authentificateUser(){
  //   this.router.navigate(['authentification'])
  // }
}
