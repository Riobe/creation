'use strict';

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthService } from './services';

@Component({
  templateUrl: './login.template.pug',
  styleUrls: ['./login.styles.scss']
})
export class LoginComponent {
  public JSON: any;
  public Object: any;
  public mouseoverLogin: boolean;
  public loginInvalid: boolean = false;

  constructor(public authService: AuthService, public router: Router) {
    this.JSON = JSON;
    this.Object = Object;
    this.mouseoverLogin = false;
  }

  public login(loginForm: NgForm, event: Event) {
    event.preventDefault();

    this.authService
      .loginUser(loginForm.value.userName, loginForm.value.password)
      .subscribe(res => {
        this.loginInvalid = !res;

        if (res) {
          this.router.navigate(['events']);
        }
      });
  }

  public cancel() {
    this.router.navigate(['events']);
  }
}
