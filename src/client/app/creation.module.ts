'use strict';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routes } from './creation.routes';

import { CreationComponent } from './creation.component';
import { HomeComponent } from './home.component';
import { NavBarComponent } from './navbar.component';
import { Error404Component } from './shared/errors';

// The following are all external libraries.
import {
  TOASTR_TOKEN,
  JQUERY_TOKEN
} from './libraries';

/* tslint:disable:no-string-literal */
let toastr = window['toastr'],
    $ = window['$'];
/* tslint:enable:no-string-literal */

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpModule,
    BrowserAnimationsModule
  ],
  declarations: [
    CreationComponent,
    HomeComponent,
    NavBarComponent,
    Error404Component
  ],
  providers: [
    {
      provide: TOASTR_TOKEN,
      useValue: toastr
    },
    {
      provide: JQUERY_TOKEN,
      useValue: $
    }
  ],
  bootstrap: [ CreationComponent ]
})
export class CreationModule { }