'use strict';

import { Component } from '@angular/core';
import { CharactersService } from '../services';

@Component({
  selector: 'charactor-creator',
  templateUrl: './character-creator.template.pug',
})
export class CharacterCreatorComponent {
  constructor(public charactersService: CharactersService) {}
}
