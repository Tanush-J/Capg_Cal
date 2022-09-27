import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorModalComponent } from './calculator-modal.component';

describe('CalculatorModalComponent', () => {
  let component: CalculatorModalComponent;
  let fixture: ComponentFixture<CalculatorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculatorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
