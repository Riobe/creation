'use strict';

import { Routes } from '@angular/router';

// Events
import {
  // Components
  EventsListComponent,
  EventDetailsComponent,
  CreateEventComponent,
  CreateSessionComponent,

  // Services
  EventsListResolver,
  EventResolver
} from './events';

import { KendoDemoComponent } from './components/kendo-demo.component';
import { Error404Component } from './errors/404.component';

import { routes as userRoutes } from './user/user.routes';

export const routes: Routes = [
  { path: 'events', component: EventsListComponent, resolve: {events: EventsListResolver} },
  { path: 'events/new', component: CreateEventComponent, canDeactivate: ['canDeactivateCreateEvent'] },
  { path: 'events/session/new', component: CreateSessionComponent },
  // { path: 'event/:id', component: EventDetailsComponent, canActivate: [EventRouteActivatorService] },
  { path: 'event/:id', component: EventDetailsComponent, resolve: { event: EventResolver }},
  { path: 'kendo', component: KendoDemoComponent },
  { path: '404', component: Error404Component },
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  // { path: 'user', loadChildren: './user/user.module#UserModule' },
  { path: 'user', children: userRoutes },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
