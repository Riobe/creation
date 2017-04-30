'use strict';

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ISession } from '../models';
import { restrictedWords } from '../../validators';

@Component({
  selector: 'create-session',
  templateUrl: './create-session.template.pug'
})
export class CreateSessionComponent implements OnInit {
  @Output() public saveNewSession = new EventEmitter();
  @Output() public cancelNewSession = new EventEmitter();
  public name: FormControl;
  public presenter: FormControl;
  public duration: FormControl;
  public level: FormControl;
  public abstract: FormControl;

  public newSessionForm: FormGroup;

  public cancel() {
    this.cancelNewSession.emit();
  }

  public saveSession(formValues) {
    const session: ISession = {
      id: undefined,
      name: formValues.name,
      presenter: formValues.presenter,
      duration: +formValues.duration,
      level: formValues.level,
      abstract: formValues.abstract,
      voters: []
    };

    this.saveNewSession.emit(session);
  }

  public ngOnInit() {
    this.name = new FormControl('', Validators.required);
    this.presenter = new FormControl('', Validators.required);
    this.duration = new FormControl('', Validators.required);
    this.level = new FormControl('', Validators.required);
    this.abstract = new FormControl('', [
      Validators.required,
      Validators.maxLength(400),
      restrictedWords(['foo', 'bar'])
    ]);

    this.newSessionForm = new FormGroup({
      name: this.name,
      presenter: this.presenter,
      duration: this.duration,
      level: this.level,
      abstract: this.abstract
    });
  }
}
