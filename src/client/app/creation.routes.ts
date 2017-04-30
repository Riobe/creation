'use strict';

import { Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { Error404Component } from './shared/errors';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', component: Error404Component },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
