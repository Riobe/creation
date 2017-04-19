'use strict';

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'upvote',
  template: require('./upvote.template.pug')(),
  styles: [require('./upvote.styles.scss')]
})
export class UpvoteComponent {
  @Input() public count: number;
  @Input() public set voted(val) {
    this.iconColor = val ? 'red' : 'white';
  }
  @Output() public vote: EventEmitter<object> = new EventEmitter();
  public iconColor: string;

  public onClick() {
    this.vote.emit({});
  }
}
