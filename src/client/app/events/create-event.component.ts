'use strict';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from './services';

@Component({
  templateUrl: './create-event.template.pug'
})
export class CreateEventComponent {
  public event;
  public isDirty = true;
  public name: string;
  public date: string;
  public time: string;
  public price: number;
  public address: string;
  public city: string;
  public country: string;
  public onlineUrl: string;
  public imageUrl: string;

  constructor(public router: Router, public eventService: EventService) { }

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
