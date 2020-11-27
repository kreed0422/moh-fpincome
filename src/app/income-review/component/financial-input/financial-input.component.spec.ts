import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextMaskModule } from 'angular2-text-mask';

import { FinancialInputComponent } from './financial-input.component';

describe('FinancialInputComponent', () => {
  let component: FinancialInputComponent;
  let fixture: ComponentFixture<FinancialInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialInputComponent],
      imports: [TextMaskModule],
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
