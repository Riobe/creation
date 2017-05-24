'use strict';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class CharactersService {
  public currentCharacter;

  constructor(private http: Http) { }

  public getCharacter(id): Promise<any> {
    const url = `/api/characters/${id}`;
    const options = new RequestOptions(new Headers({
      'Content-Type': 'application/json'
    }));

    return this.http.get(url).map((response: Response) => {
        const event = response.json();
        return event;
      })
      .toPromise()
      .then(character => {
        return this.currentCharacter = character;
      })
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    throw error.statusText;
  }
}
