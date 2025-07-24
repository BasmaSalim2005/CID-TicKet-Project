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

const routes: Routes = [
  { path: '', redirectTo: 'tickets/tickets', pathMatch: 'full' },
  { path: 'services/authentification', component: Authentification },
  { path: 'applications/apps', component: Apps },
  { path: 'applications/appsadmin', component: AppsAdmin },
  { path: 'features/features', component: Features },
  { path: 'application/addapplication', component: AddApplication }, 
  { path: 'tickets/assignedtickets', component: AssignedTicketsComponent }, 
  { path: 'tickets/tickets', component: Tickets }, 
  { path: 'tickets/details/:id', component: TicketDetails },
  { path: 'feedback/appfeedback', component: Appfeedback }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
