'use strict';

import { Component } from '@angular/core';

@Component({
  template: require('./404.template.pug')(),
  styles: [require('./404.styles.scss')]
})
export class Error404Component { }
