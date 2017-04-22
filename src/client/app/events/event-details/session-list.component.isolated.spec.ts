'use strict';

import { SessionListComponent } from './session-list.component';
import { ISession } from './../models';

import { expect } from 'chai';

describe('SessionListComponent', function() {
  let component: SessionListComponent,
      mockAuthService,
      mockVoterService;

  beforeEach(function() {
    component = new SessionListComponent(mockAuthService, mockVoterService);
  });

  describe('#ngOnChanges', function() {
    it('should sort the sessions by name correctly', function() {
      component.sessions = [
        { name: 'session 1', level: 'intermediate' },
        { name: 'session 3', level: 'beginner' },
        { name: 'session 2', level: 'intermediate' }
      ] as ISession[];
      component.filterBy = 'all';
      component.sortBy = 'name';
      component.eventId = 3;

      component.ngOnChanges();

      expect(component.visibleSessions[2]).to.have.property('name', 'session 3');
    });

    it('should filter the sessions correctly', function() {
      component.sessions = [
        { name: 'session 1', level: 'intermediate' },
        { name: 'session 2', level: 'intermediate' },
        { name: 'session 3', level: 'beginner' }
      ] as ISession[];
      component.filterBy = 'intermediate';
      component.sortBy = 'name';
      component.eventId = 3;

      component.ngOnChanges();

      expect(component.visibleSessions).to.have.lengthOf(2);
    });
  });
});
