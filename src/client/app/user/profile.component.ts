'use strict';

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './services';
import { TOASTR_TOKEN, IToastr } from '../services';

@Component({
  template: require('./profile.template.pug')(),
  styles: [require('./profile.styles.scss')]
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public firstName: FormControl;
  public lastName: FormControl;

  constructor(private router: Router,
              private authService: AuthService,
              @Inject(TOASTR_TOKEN) private toastr: IToastr) {
  }

  public ngOnInit() {
    if (!this.authService.currentUser) {
      throw new Error('Cannot initialize this page without logging in.');
    }

    this.firstName = new FormControl(this.authService.currentUser.firstName, [
      Validators.required,
      Validators.pattern('[a-zA-Z].*')
    ]);
    this.lastName = new FormControl(this.authService.currentUser.lastName, Validators.required);
    this.profileForm = new FormGroup({
      firstName: this.firstName,
      lastName: this.lastName
    });
  }

  public saveProfile(profileValues, event: Event) {
    if (this.profileForm.invalid) {
      return;
    }

    event.preventDefault();

    this.authService
      .updateCurrentUser(profileValues.firstName, profileValues.lastName)
      .subscribe(() => {
        this.toastr.success('Profile Saved');
        this.router.navigate(['events']);
      });
  }

  public logout(event: Event) {
    event.preventDefault();
    this.authService.logout().subscribe(() => {
      this.router.navigate(['user/login']);
    });
  }

  public cancel() {
    this.router.navigate(['events']);
  }

  public firstNameError() {
    if (this.firstName.valid || this.firstName.untouched) {
      return undefined;
    }

    if (this.firstName.errors.required) {
      return 'required';
    }

    if (this.firstName.errors.pattern) {
      return 'pattern';
    }

    return 'error';
  }

  public validateLastName() {
    return this.lastName.valid || this.lastName.untouched;
  }
}
