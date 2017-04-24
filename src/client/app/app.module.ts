'use strict';

// This is silly... so many imports.

// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Events
import {
  // Components
  EventsListComponent,
  EventThumbnailComponent,
  EventDetailsComponent,
  CreateEventComponent,
  CreateSessionComponent,
  SessionListComponent,
  UpvoteComponent,
  LocationValidator,

  // Services
  EventService,
  EventsListResolver,
  EventResolver,
  VoterService
} from './events';

// Auth
import {
  AuthService
} from './user/services';

// Components
import { EventsAppComponent } from './events-app.component';
import { NavBarComponent } from './nav/navbar.component';
import { Error404Component } from './errors/404.component';
import {
  CollapsibleWellComponent,
  SimpleModalComponent
} from './components';

// Services
import {
  TOASTR_TOKEN,
  IToastr,
  JQUERY_TOKEN
} from './services';
// Globally defined.
declare const toastr: IToastr;
declare const $: object;

// Pipes
import { DurationPipe } from './pipes';

// Directives
import { ModalTriggerDirective } from './directives';

// Misc
import { routes } from './routes';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    HttpModule
  ],
  declarations: [
    EventsAppComponent,
    EventsListComponent,
    EventThumbnailComponent,
    EventDetailsComponent,
    SessionListComponent,
    CreateEventComponent,
    CreateSessionComponent,
    LocationValidator,
    NavBarComponent,
    CollapsibleWellComponent,
    SimpleModalComponent,
    UpvoteComponent,
    Error404Component,
    ModalTriggerDirective,
    DurationPipe
  ],
  providers: [
    EventService,
    EventsListResolver,
    EventResolver,
    AuthService,
    VoterService,
    {
      provide: TOASTR_TOKEN,
      useValue: toastr
    },
    {
      provide: JQUERY_TOKEN,
      useValue: $
    },
    {
      provide: 'canDeactivateCreateEvent',
      useValue: checkDirtyState
    }
  ],
  bootstrap: [ EventsAppComponent ]
})
export class AppModule { }

function checkDirtyState(component) {
  if (component.isDirty) {
    return window.confirm('You have not saved this event, do you really want to cancel?');
  }

  return true;
}