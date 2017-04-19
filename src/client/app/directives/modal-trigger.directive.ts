'use strict';

import { Directive, OnInit, Inject, ElementRef, Input } from '@angular/core';
import { JQUERY_TOKEN } from '../services';

@Directive({
  selector: '[modal-trigger]'
})
export class ModalTriggerDirective implements OnInit {
  @Input('modal-trigger') public modalId: string;
  private element: HTMLElement;

  constructor(el: ElementRef, @Inject(JQUERY_TOKEN) private $: any) {
    this.element = el.nativeElement;
  }

  public ngOnInit() {
    this.element.addEventListener('click', event => {
      this.$(`#${this.modalId}`).modal({});
    });
  }
}
