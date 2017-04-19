'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EventService } from '../services/event.service';
import { IEvent, ISession } from '../models';

@Component({
  template: require('./event-details.template.pug')(),
  styles: [require('./event-details.styles.scss')]
})
export class EventDetailsComponent implements OnInit {
  public event: IEvent;
  public addMode: boolean;
  public filterBy: string = 'all';
  public sortBy: string = 'votes';
  public debugEvent: string;

  constructor(private eventService: EventService, private route: ActivatedRoute) { }

  public addSession() {
    this.addMode = true;
  }

  public saveNewSession(newSession: ISession) {
    const maxSessionId = Math.max.apply(Math, this.event.sessions.map(session => session.id));
    newSession.id = maxSessionId + 1;

    this.event.sessions.push(newSession);
    this.eventService.updateEvent(this.event).subscribe();
    this.addMode = false;
  }

  public cancelNewSession() {
    this.addMode = false;
  }

  public ngOnInit() {
    this.route.data.forEach(data => {
        this.event = data.event;
        this.debugEvent = JSON.stringify(this.event, null, 2);
        this.addMode = false;
        this.filterBy = 'all';
        this.sortBy = 'votes';
      });
  }
}
