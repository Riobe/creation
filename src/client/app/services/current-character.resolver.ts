'use strict';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CharactersService } from './characters.service';

@Injectable()
export class CurrentCharacterResolver implements Resolve<any> {
  constructor(private charactersService: CharactersService) { }

  public resolve() {
    if (this.charactersService.currentCharacter) {
      return Promise.resolve(this.charactersService.currentCharacter);
    }

    return this.charactersService.getCharacter(1);
  }
}
