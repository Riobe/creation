'use strict';

import { IEvent, ISession } from '../models';

import { Injectable, EventEmitter } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class EventService {
  constructor(private http: Http) { }

  public getEvents(): Observable<IEvent[]> {
    return this.http.get('/api/events').map((response: Response) => {
      const events = response.json() as IEvent[];
      return events;
    })
    .catch(this.handleError);
  }

  public getEvent(id): Observable<IEvent> {
    return this.http.get('/api/events/' + id).map((response: Response) => {
      const event = response.json() as IEvent;
      return event;
    })
    .catch(this.handleError);
  }

  public saveEvent(event: IEvent): Observable<IEvent> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({headers});

    return this.http.post('/api/events', event, options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  public searchSessions(searchTerm: string) {
    return this.http.get('/api/events/sessions/search?search=' + searchTerm).map((response: Response) => {
      return response.json();
    })
    .catch(this.handleError);
  }

  public updateEvent(event) {
    const options = new RequestOptions(new Headers({
      'Content-Type': 'application/json'
    }));

    return this.http.put('/api/events/' + event.id, event, options)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.statusText);
  }
}
