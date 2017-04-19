'use strict';

import { Component } from '@angular/core';
import { AuthService } from '../user/services';
import { ISession } from '../events/models';
import { EventService } from '../events/services';

@Component({
  selector: 'nav-bar',
  template: require('./navbar.template.pug')(),
  styles: [require('./navbar.styles.scss')]
})
export class NavBarComponent {
  public searchTerm: string = '';
  public foundSessions: ISession[];

  constructor(private authService: AuthService, private eventService: EventService) { }

  public searchSessions(searchTerm) {
    this.eventService.searchSessions(searchTerm).subscribe(sessions => {
      this.foundSessions = sessions;
    });
  }
}
