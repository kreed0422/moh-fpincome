import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
  inject,
} from '@angular/core/testing';

import { IncomeComponent } from './income.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { TextMaskModule } from 'angular2-text-mask';
import {
  getDebugElement,
  MockRouter,
} from '../../../_developmentHelpers/test-helpers';
import { Router } from '@angular/router';
import { IncomeReviewDataService } from '../../services/income-review-data.service';

class MockDataService {
  hasSpouse: boolean;
}

function setInputField(
  fixture: ComponentFixture<any>,
  fieldName: string,
  value: string = null
) {
  const _de = getDebugElement(fixture, 'input', fieldName);
  const el = _de.nativeElement;
  el.focus();
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
  el.dispatchEvent(new Event('blur'));
}

describe('IncomeComponent', () => {
  let component: IncomeComponent;
  let fixture: ComponentFixture<IncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        TextMaskModule,
      ],
      providers: [
        {
          provide: ComponentFixtureAutoDetect,
          useValue: true,
        },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display fields related to spouse when no spouse indicated', () => {
    expect(getDebugElement(fixture, 'input', 'spOriginalIncome')).toBeNull();
    expect(getDebugElement(fixture, 'input', 'spReducedIncome')).toBeNull();
    expect(getDebugElement(fixture, 'input', 'spRemainderIncome')).toBeNull();
    expect(getDebugElement(fixture, 'input', 'spSubtotal')).toBeNull();
    expect(getDebugElement(fixture, 'input', 'total')).toBeNull();
  });

  it('should display fields related to spouse when spouse indicated', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.hasSpouse = true;
      fixture.detectChanges();

      fixture.whenRenderingDone().then(() => {
        expect(
          getDebugElement(fixture, 'input', 'spOriginalIncome')
        ).not.toBeNull();
        expect(
          getDebugElement(fixture, 'input', 'spReducedIncome')
        ).not.toBeNull();
        expect(
          getDebugElement(fixture, 'input', 'spRemainderIncome')
        ).not.toBeNull();
        expect(getDebugElement(fixture, 'input', 'spSubtotal')).not.toBeNull();
        expect(getDebugElement(fixture, 'input', 'total')).not.toBeNull();
      });
    }
  ));
});
