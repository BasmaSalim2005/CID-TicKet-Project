import { APP_INITIALIZER, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { SidebarComponent } from './components/sidebar/sidebar';
import { HeaderComponent } from './components/header';
import { Tickets } from './tickets/tickets';
import { Allfeedback } from './feedback/allfeedback/allfeedback';
import { History } from './tickets/history/history';
import { Summary } from './feedback/summary/summary';
import { Ratingdialogue } from './feedback/ratingdialogue/ratingdialogue';
import { AssignedCount } from './tickets/assigned-count/assigned-count';
import { JwtInterceptor } from './services/JwtInterceptor';




@NgModule({
  declarations: [
    App,
    // AssignedCount,
    // Allfeedback,
    // Summary,
    // Ratingdialogue,
    // History,
    // Admintic,
 
    // Appfeedback,
      //  Addfeedback,
    // Tickets
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    SidebarComponent,
    HeaderComponent,
    MatCardModule,
    MatIconModule,
    MatDialogModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  // providers: [
  //   //added keycloak here
  //   KeycloakService,
  //   {
  //     provide: APP_INITIALIZER,
  //     useFactory: initializeKeycloak,
  //     multi: true,
  //     deps: [KeycloakService],
  //   },
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: KeycloakHttpInterceptor,
  //     multi: true,
  //   },
  // ],
  bootstrap: [App]
})
export class AppModule { }
