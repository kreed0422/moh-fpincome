import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInputComponent } from './financial-input.component';

describe('FinancialInputComponent', () => {
  let component: FinancialInputComponent;
  let fixture: ComponentFixture<FinancialInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
