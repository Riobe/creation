'use strict';

import { Component, OnInit } from '@angular/core';
import { CharactersService } from '../shared/services';

@Component({
  templateUrl: './home.template.pug',
})
export class HomeComponent implements OnInit {
  public character;
  constructor(public charactersService: CharactersService) {}

  public ngOnInit() {
    this.charactersService.getCharacter(1).then(character => {
      this.character = JSON.stringify(character, null, 2);
    });
  }
}
