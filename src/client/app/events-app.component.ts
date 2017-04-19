'use strict';

import { Component, OnInit } from '@angular/core';
import { AuthService } from './user/services';

@Component({
  selector: 'events-app',
  template: require('./events-app.template.pug')()
})
export class EventsAppComponent implements OnInit {
  constructor(private auth: AuthService) { }

  public ngOnInit() {
    this.auth.checkAuthenticationStatus();
  }
}
