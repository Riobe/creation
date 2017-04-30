'use strict';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { SessionListComponent } from './session-list.component';
import { ISession } from './../models';
import { AuthService } from './../../user/services';
import { VoterService } from '../services';
// import { UpvoteComponent } from './upvote.component';
import { DurationPipe } from '../../pipes';
import { CollapsibleWellComponent } from '../../components';

import { expect } from 'chai';
import { spy, stub } from 'sinon';

describe('SessionListComponent', function() {
  let fixture: ComponentFixture<SessionListComponent>,
      component: SessionListComponent,
      element: HTMLElement,
      debugElement: DebugElement;

  beforeEach(async(function() {
    let mockAuthService = {
          isAuthenticated: stub().returns(true),
          currentUser: {
            userName: 'riobe'
          }
        },
        mockVoterService = {
          userHasVoted: spy()
        };

    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );

    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        SessionListComponent,
        // UpvoteComponent, // We can leave this out due to the NO_ERRORS_SCHEMA
        DurationPipe,
        CollapsibleWellComponent
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: VoterService, useValue: mockVoterService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  }));

  beforeEach(function() {
    fixture = TestBed.createComponent(SessionListComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    element = fixture.nativeElement;
  });

  describe('initial display', function() {
    it('should have the correct session title', function() {
      component.sessions = [
        {
          id: 3,
          name: 'Session 1',
          presenter: 'Joe',
          duration: 1,
          level: 'beginner',
          abstract: 'abstract',
          voters: ['john', 'bob']
        }];
      component.filterBy = 'all';
      component.sortBy = 'name';
      component.eventId = 4;

      component.ngOnChanges({} as SimpleChanges);
      fixture.detectChanges();

      // The following two assertions are different ways of doing the same thing.
      expect(element.querySelector('[well-title]').textContent).to.contain('Session 1');
      expect(debugElement.query(By.css('[well-title]'))).to.have
        .deep.property('nativeElement.textContent')
        .that.contains('Session 1');
    });
  });
});
