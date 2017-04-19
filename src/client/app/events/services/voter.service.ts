'use strict';

import { Injectable } from '@angular/core';
import { ISession } from '../models';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class VoterService {
  constructor(private http: Http) { }

  public addVoter(eventId: number, session: ISession, voterName: string) {
    const url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;
    const options = new RequestOptions(new Headers({
      'Content-Type': 'application/json'
    }));

    session.voters.push(voterName);
    return this.http.post(url, JSON.stringify({}), options)
      .catch(error => Observable.throw(error.statusText));
  }

  public deleteVoter(eventId: number, session: ISession, voterName: string) {
    const url = `/api/events/${eventId}/sessions/${session.id}/voters/${voterName}`;

    session.voters = session.voters.filter(voter => voter !== voterName);
    return this.http.delete(url)
      .catch(error => Observable.throw(error.statusText));
  }

  public userHasVoted(session: ISession, voterName: string) {
    return session.voters.some(name => name === voterName);
  }
}
