'use strict';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapsible-well',
  templateUrl: './collapsible-well.template.pug'
})
export class CollapsibleWellComponent {
  public visible: boolean = true;

  public toggleContent() {
    this.visible = !this.visible;
  }
}
