'use strict';

// This service isn't being used in favor of a resolve on the component.

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { EventService } from './event.service';

@Injectable()
export class EventRouteActivatorService implements CanActivate {
  constructor(private eventService: EventService, private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot) {
    const eventExists = !!this.eventService.getEvent(+route.params.id);

    if (!eventExists) {
      this.router.navigate(['/404']);
    }

    return eventExists;
  }
}
