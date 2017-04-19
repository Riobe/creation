'use strict';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './services';

@Component({
  template: require('./create-event.template.pug')(),
  styles: [require('./create-event.styles.scss')]
})
export class CreateEventComponent {
  public event;
  public isDirty = true;

  constructor(private router: Router, private eventService: EventService) { }

  public saveEvent(formValues) {
    console.log(formValues);
    this.eventService.saveEvent(formValues).subscribe(() => {
      this.isDirty = false;
      this.router.navigate(['/events']);
    });
  }

  public cancel() {
    this.router.navigate(['/events']);
  }
}
