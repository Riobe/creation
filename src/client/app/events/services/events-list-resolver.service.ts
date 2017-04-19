'use strict';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { EventService } from './event.service';

@Injectable()
export class EventsListResolver implements Resolve<any> {
  constructor(private eventService: EventService) { }

  public resolve() {
    return this.eventService.getEvents();
  }
}
