'use strict';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapsible-well',
  template: require('./collapsible-well.template.pug')()
})
export class CollapsibleWellComponent {
  public visible: boolean = true;

  public toggleContent() {
    this.visible = !this.visible;
  }
}
