'use strict';

import { Component, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../user/services';
import { VoterService } from '../services';
import { ISession } from '../models';

@Component({
  selector: 'session-list',
  template: require('./session-list.template.pug')(),
  styles: [require('./session-list.styles.scss')]
})
export class SessionListComponent implements OnChanges {
  @Input() public sessions: ISession[];
  @Input() public filterBy: string;
  @Input() public sortBy: string;
  @Input() public eventId: number;
  public visibleSessions: ISession[];

  private sortingMethods = {
    name: this.sortByName,
    votes: this.sortByVotes
  };

  constructor(private authService: AuthService, private voterService: VoterService) { }

  public filterSessions(filter: string) {
    if (filter === 'all') {
      this.visibleSessions = this.sessions.slice(0);
    } else {
      this.visibleSessions = this.sessions.filter(session => {
        return session.level.toLocaleLowerCase() === filter;
      });
    }

    if (this.sortingMethods[this.sortBy]) {
      this.visibleSessions.sort(this.sortingMethods[this.sortBy]);
    }
  }

  public toggleVote(session: ISession) {
    if (this.userHasVoted(session)) {
      this.voterService.deleteVoter(this.eventId, session, this.authService.currentUser.userName).subscribe();
    } else {
      this.voterService.addVoter(this.eventId, session, this.authService.currentUser.userName).subscribe();
    }

    if (this.sortBy === 'votes') {
      this.visibleSessions.sort(this.sortingMethods.votes);
    }
  }

  public userHasVoted(session: ISession) {
    return this.voterService.userHasVoted(session, this.authService.currentUser.userName);
  }

  public ngOnChanges() {
    if (!this.sessions) {
      return;
    }

    this.filterSessions(this.filterBy);
  }

  private sortByName(left: ISession, right: ISession) {
    return left.name.localeCompare(right.name);
  }

  private sortByVotes(left: ISession, right: ISession) {
    return right.voters.length - left.voters.length;
  }
}
