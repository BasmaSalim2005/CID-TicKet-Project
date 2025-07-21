import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Authentification } from './services/authentification/authentification';
import { Apps } from './applications/apps/apps';
import { Features } from './features/features';
import { AddApplication } from './applications/add-application/add-application';
import { AppsAdmin } from './applications/apps-admin/apps-admin';
import { Tickets } from './tickets/tickets';
import { Appfeedback } from './feedback/appfeedback/appfeedback';
import { TicketDetails } from './tickets/ticdetails/user/ticket-details';
import { AssignedTicketsComponent } from './tickets/assigned-tickets/assigned-tickets-component';
import { Admintic } from './tickets/admintic/admintic';
import { Allfeedback } from './feedback/allfeedback/allfeedback';
import { History } from './tickets/history/history';
import { TicketDetailsDevTech } from './tickets/ticdetails/devTech/ticket-details-devtech';
import { TicketDetailsAdmin } from './tickets/ticdetails/admin/ticket-details-admin';
import { RoleAuthGuard } from './services/role-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'services/authentification', pathMatch: 'full' },
  { path: 'services/authentification', component: Authentification },
  { path: 'applications/apps', component: Apps, canActivate: [RoleAuthGuard], data: { roles: [ 'DEVELOPER'] } },
  { path: 'applications/appsadmin', component: AppsAdmin, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'features', component: Features, canActivate: [RoleAuthGuard], data: { roles: [ 'DEVELOPER',  'ADMIN'] } },
  // { path: 'features/admin', component: Features, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'application/addapplication', component: AddApplication, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } }, 
  { path: 'tickets/assignedticketscomponent', component: AssignedTicketsComponent, canActivate: [RoleAuthGuard], data: { roles: ['DEVELOPER', 'TECHNICIAN'] } }, 
  { path: 'tickets', component: Tickets, canActivate: [RoleAuthGuard], data: { roles: ['USER', 'DEVELOPER', 'TECHNICIAN', 'ADMIN'] } }, 
  { path: 'tickets/admintic', component: Admintic, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'tickets/history', component: History, canActivate: [RoleAuthGuard], data: { roles: ['USER', 'DEVELOPER', 'TECHNICIAN', 'ADMIN'] } },
  { path: 'tickets/ticdetails/user/:id', component: TicketDetails, canActivate: [RoleAuthGuard], data: { roles: ['USER', 'USER', 'DEVELOPER', 'TECHNICIAN','ADMIN' ] } },
  { path: 'tickets/ticdetails/devTech/:id', component: TicketDetailsDevTech, canActivate: [RoleAuthGuard], data: { roles: ['DEVELOPER', 'TECHNICIAN'] } },
  { path: 'tickets/ticdetails/admin/:id', component: TicketDetailsAdmin, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'feedback/appfeedback', component: Appfeedback, canActivate: [RoleAuthGuard], data: { roles: ['USER', 'DEVELOPER', 'TECHNICIAN','ADMIN' ] } },
  { path: 'feedback/allfeedback', component: Allfeedback, canActivate: [RoleAuthGuard], data: { roles: ['ADMIN'] } },
  { path: 'not-authorized', component: Authentification },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
