import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[mouseAction]'
})
export class MouseActionDirective {

  constructor(private elRef: ElementRef) { 
  }
  @HostListener('mouseover') onMouseOver() {
    this.changeTextColor('blue');
    this.changeTextSize('22px');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.changeTextColor('black');
    this.changeTextSize('16px');
  }
  changeTextColor(color: string){
    this.elRef.nativeElement.style.color = color;
  }
  changeTextSize(size: string){
    this.elRef.nativeElement.style.fontSize=size;
  }

}
