import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[colorRed]'
})
export class ColorRedDirective {

  constructor(elRef: ElementRef) {
    elRef.nativeElement.style.color = 'red';
  }

}
