'use strict';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharactersService } from '../services';

@Component({
  templateUrl: './home.template.pug',
})
export class HomeComponent implements OnInit {
  public character;
  constructor(private route: ActivatedRoute, private charactersService: CharactersService) {}

  public ngOnInit() {
    let routeCharacter = this.route.snapshot.data.character;
    this.character = JSON.stringify(routeCharacter, null, 2);
  }
}
