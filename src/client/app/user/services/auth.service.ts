'use strict';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { IUser } from '../models';

@Injectable()
export class AuthService {
  public currentUser: IUser;

  constructor(private http: Http) { }

  public loginUser(userName: string, password: string) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });
    const options = new RequestOptions({headers});
    const loginInfo = {
      userName,
      password
    };

    return this.http.post('/api/login', loginInfo, options)
      .do(response => {
        if (response) {
          this.currentUser = response.json() as IUser;
        }
      })
      .catch(error => {
        return Observable.of(false);
      });
  }

  public logout() {
    this.currentUser = undefined;

    const options = new RequestOptions(new Headers({
      'Content-Type': 'application/json'
    }));

    return this.http.post('/api/logout', {}, options)
      .catch(error => {
        return Observable.throw(error.statusText);
      });
  }

  public checkAuthenticationStatus() {
    return this.http.get('/api/current-identity').map((response: any) => {
        if (response._body) {
          return response.json();
        } else {
          return {};
        }
      })
      .do(currentUser => {
        if (!!currentUser.userName) {
          this.currentUser = currentUser;
        }
      })
      .subscribe();
  }

  public isAuthenticated() {
    return !!this.currentUser;
  }

  public updateCurrentUser(firstName: string, lastName: string) {
    console.log(`User will now be: ${firstName} ${lastName}`);
    this.currentUser.firstName = firstName;
    this.currentUser.lastName = lastName;

    const options = new RequestOptions(new Headers({
      'Content-Type': 'application/json'
    }));

    return this.http.put(`/api/users/${this.currentUser.id}`, this.currentUser, options)
      .catch(error => {
        return Observable.of(false);
      });
  }
}
