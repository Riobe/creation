'use strict';

import { Component, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { JQUERY_TOKEN } from '../services';

@Component({
  selector: 'simple-modal',
  templateUrl: './simple-modal.template.pug',
  styleUrls: ['./simple-modal.styles.scss']
})
export class SimpleModalComponent {
  @Input() public title: string;
  @Input() public elementId: string;
  @Input() public closeOnBodyClick: string;
  @ViewChild('modalContainer') public containerElement: ElementRef;

  constructor(@Inject(JQUERY_TOKEN) public $: any) { }

  public closeModal() {
    if (this.closeOnBodyClick.toLocaleLowerCase() === 'true') {
      this.$(this.containerElement.nativeElement).modal('hide');
    }
  }
}
