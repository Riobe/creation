'use strict';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IEvent } from './models';

@Component({
  selector: 'event-thumbnail',
  templateUrl: './event-thumbnail.template.pug',
  styleUrls: ['./event-thumbnail.styles.scss']
})
export class EventThumbnailComponent {
  @Input() public event: IEvent;
  @Output() public signedUp = new EventEmitter();

  public signUp() {
    console.log(`The user wants to sign up to: ${this.event.name}`);
    this.signedUp.emit(this.event);
  }

  public report() {
    console.log('This was accessed through a template variable.');
  }

  public earlyStartClasses() {
    const isEarlyStart = this.event.time === '8:00 am';

    /* Returned as object.
    return {
      green: isEarlyStart,
      bold: isEarlyStart
    }; */

    // Can use array instead of space separated string.
    return isEarlyStart ?
      'green bold' : // Space separated list of classes.
      ''; // Empty string means no classes.
  }
}
