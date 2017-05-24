'use strict';

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CharactersService } from '../services';

@Component({
  selector: 'charactor-creator',
  templateUrl: './character-creator.template.pug',
})
export class CharacterCreatorComponent {
  public characterForm: FormGroup;
  public validCastes = [
    'Dawn',
    'Zenith',
    'Twilight',
    'Night',
    'Eclipse'
  ];

  // public characterForm = new FormGroup({
    // name: new FormControl()
  // });

  constructor(private charactersService: CharactersService, private formBuilder: FormBuilder) {
    this.characterForm = this.formBuilder.group({
      name: ['', Validators.required],
      concept: '',
      caste: ['', Validators.required]
    });
  }
}
