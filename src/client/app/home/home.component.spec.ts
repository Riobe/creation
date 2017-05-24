'use strict';

import { ActivatedRoute } from '@angular/router';

import { HomeComponent } from './home.component';

import { expect } from 'chai';
import { stub } from 'sinon';

describe('HomeComponent', function() {
  let component: HomeComponent,
    mockCharactersService,
    mockCharacter = {
      name: 'tester'
    };

  let mockRoute: any = {
      snapshot: {
        data: {
          character: mockCharacter
        }
      }
    };

  beforeEach(function() {
    mockCharactersService = {
      getCharacter: stub().returns(Promise.resolve(mockCharacter))
    };
    component = new HomeComponent(mockRoute, mockCharactersService);
  });

  describe('#ngOnInit', function() {
    it('get an initial character.', function() {
      component.ngOnInit();

      expect(component.character).to.be.ok;
      expect(component.character).to.equal(JSON.stringify(mockCharacter, null, 2));
    });
  });
});
