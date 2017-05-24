'use strict';

import { HomeComponent } from './home.component';

import { expect } from 'chai';
import { stub } from 'sinon';

describe('HomeComponent', function() {
  let component: HomeComponent,
      mockCharactersService,
      mockCharacter = {
        name: 'tester'
      };

  beforeEach(function() {
    mockCharactersService = {
      getCharacter: stub().returns(Promise.resolve(mockCharacter))
    };
    component = new HomeComponent(mockCharactersService);
  });

  describe('#ngOnInit', function() {
    it('get an initial character.', function() {
      component.ngOnInit();

      expect(mockCharactersService.getCharacter.callCount).to.equal(1);
      // expect(component.character).to.be.ok;
      // expect(component.character.name).to.be(JSON.stringify(mockCharacter, null, 2));
    });
  });
});
