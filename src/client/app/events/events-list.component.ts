'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IEvent } from './models';

@Component({
  selector: 'events-list',
  template: require('./events-list.template.pug')(),
  styles: [require('./events-list.styles.scss')]
})
export class EventsListComponent implements OnInit {
  public events: IEvent[];

  constructor(private route: ActivatedRoute) { }

  public registerEvent(event) {
    console.log(`The user wants to register for event: ${event.name}`);
  }

  public ngOnInit() {
    // this.eventService.getEvents().subscribe(events => { this.events = events; });
    this.events = this.route.snapshot.data.events;
  }
}
