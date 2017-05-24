'use strict';

import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CharacterCreatorComponent } from './character-creator/character-creator.component';
import { Error404Component } from './errors/404.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'character-creator', component: CharacterCreatorComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '404', component: Error404Component },
  { path: '**', redirectTo: '404', pathMatch: 'full' }
];
