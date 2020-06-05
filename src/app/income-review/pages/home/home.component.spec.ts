import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { HomeComponent } from './home.component';
import { CollectionNoticeComponent } from '../../component/collection-notice/collection-notice.component';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  getDebugElement,
  getDebugInlineError,
  getAllDebugElements,
} from '../../../_developmentHelpers/test-helpers';

class MockDataService {
  isRegistered: boolean;
  isIncomeLess: boolean;
  informationCollectionNoticeConsent: boolean = true;
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, CollectionNoticeComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        HttpClientTestingModule,
        CaptchaModule,
        ModalModule.forRoot(),
      ],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display collection notice', () => {
    expect(component.infoCollectionModal).toBeTruthy();
  });

  it('should have button on collection notice disabled', () => {
    const button = getDebugElement(
      fixture,
      'fpir-collection-notice .modal-footer button'
    );
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should be able to close the collection notice when button is enabled', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = getDebugElement(
      fixture,
      'fpir-collection-notice .modal-footer button'
    );
    expect(button.nativeElement.disabled).toBeFalsy();

    button.nativeElement.click();
    fixture.detectChanges();
    const dialog = getDebugElement(fixture, 'fpir-collection-notice .modal');
    expect(dialog.nativeElement.visable).toBeFalsy();
  });

  // Logic test for continuing
  it('should display required field errors', inject(
    [IncomeReviewDataService],
    (service: MockDataService) => {
      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();

      expect(
        component.formGroup.controls.isRegistered.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.isIncomeLess.hasError('required')
      ).toBeTruthy();

      const isRegistered = getDebugElement(
        fixture,
        'common-radio',
        'isRegistered'
      );
      const isRegisteredError = getDebugInlineError(isRegistered);
      expect(isRegisteredError).toContain('required');

      const isIncomeLess = getDebugElement(
        fixture,
        'common-radio',
        'isIncomeLess'
      );
      const isIncomeLessError = getDebugInlineError(isIncomeLess);
      expect(isIncomeLessError).toContain('required');
    }
  ));

  it('should indicate user is not eligible when not registered and income less than 10%', inject(
    [IncomeReviewDataService],
    (service: MockDataService) => {
      component.formGroup.controls.isRegistered.setValue(false);
      component.formGroup.controls.isIncomeLess.setValue(false);
      component.formGroup.updateValueAndValidity();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(
          component.formGroup.controls.isRegistered.hasError('required')
        ).toBeFalsy();
        expect(
          component.formGroup.controls.isIncomeLess.hasError('required')
        ).toBeFalsy();
        expect(component.canContinue()).toBeFalsy();
        component.continue();

        fixture.detectChanges();
        const formError = getDebugElement(
          fixture,
          'form common-error-container .error--container'
        );
        expect(formError.nativeElement.textContent).toContain('not eligible');
      });
    }
  ));

  it('should indicate user is not eligible when not income less than 10%, but registered', inject(
    [IncomeReviewDataService],
    (service: MockDataService) => {
      component.formGroup.controls.isRegistered.setValue(true);
      component.formGroup.controls.isIncomeLess.setValue(false);
      component.formGroup.updateValueAndValidity();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(
          component.formGroup.controls.isRegistered.hasError('required')
        ).toBeFalsy();
        expect(
          component.formGroup.controls.isIncomeLess.hasError('required')
        ).toBeFalsy();
        expect(component.canContinue()).toBeFalsy();
        component.continue();

        fixture.detectChanges();
        const formError = getDebugElement(
          fixture,
          'form common-error-container .error--container'
        );
        expect(formError.nativeElement.textContent).toContain('not eligible');
      });
    }
  ));

  it('should coninue when registered and income is less than 10%', inject(
    [IncomeReviewDataService],
    (service: MockDataService) => {
      component.formGroup.controls.isRegistered.setValue(true);
      component.formGroup.controls.isIncomeLess.setValue(true);
      component.formGroup.updateValueAndValidity();
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.canContinue()).toBeTruthy();
        component.continue();
        fixture.detectChanges();

        const errors = getAllDebugElements(
          fixture,
          'common-error-container .error--container'
        );
        expect(errors.length).toBe(0);
      });
    }
  ));
});
