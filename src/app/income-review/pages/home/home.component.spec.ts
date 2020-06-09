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
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  getDebugElement,
  getDebugInlineError,
  setInput,
  clickRadioButton,
  MockRouter,
  partialRequiredMsg,
} from '../../../_developmentHelpers/test-helpers';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { Router } from '@angular/router';

class MockDataService {
  isRegistered: boolean;
  isIncomeLess: boolean;
  informationCollectionNoticeConsent: boolean;
}

function setRadioButton(
  fixture: ComponentFixture<any>,
  btnName: string,
  valueName: string
) {
  const radioBtn = getDebugElement(fixture, 'common-radio', btnName);
  clickRadioButton(radioBtn, valueName);
}

function getRadioErrorMsg(fixture: ComponentFixture<any>, btnName: string) {
  const btn = getDebugElement(fixture, 'common-radio', btnName);
  return getDebugInlineError(btn);
}

function getErrorMsg(fixture: ComponentFixture<any>) {
  const formError = getDebugElement(
    fixture,
    'form common-error-container .error--container'
  );
  return formError.nativeElement.textContent;
}

function getCollectionNoticeButton(fixture: ComponentFixture<any>) {
  return getDebugElement(
    fixture,
    'fpir-collection-notice .modal-footer button'
  );
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
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display collection notice', () => {
    expect(component.infoCollectionModal).toBeTruthy();
  });

  it('should have button on collection notice disabled', () => {
    const button = getCollectionNoticeButton(fixture);
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should be able to close the collection notice when button is enabled', () => {
    setInput(fixture.debugElement, 'answer', 'irobot');
    fixture.detectChanges();
    fixture.whenRenderingDone().then(() => {
      const button = getCollectionNoticeButton(fixture);
      expect(button.nativeElement.disabled).toBeFalsy();

      button.nativeElement.click();
      fixture.detectChanges();

      const dialog = getDebugElement(fixture, 'fpir-collection-notice .modal');
      expect(dialog.nativeElement.visable).toBeFalsy();
    });
  });

  // Logic test for continuing
  it('should display required error when mandatory fields are empty', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.informationCollectionNoticeConsent = true;

      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();

      expect(getRadioErrorMsg(fixture, 'isRegistered')).toContain(
        partialRequiredMsg
      );
      expect(getRadioErrorMsg(fixture, 'isIncomeLess')).toContain(
        partialRequiredMsg
      );
    }
  ));

  it('should display not eligible when requirements are not satisfied', inject(
    [IncomeReviewDataService],
    (mockDataService: MockDataService) => {
      mockDataService.informationCollectionNoticeConsent = true;

      // Not registered and income is not 10% less
      setRadioButton(fixture, 'isRegistered', 'false');
      setRadioButton(fixture, 'isIncomeLess', 'false');
      component.continue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture)).toContain('not eligible');

      // Registered but income not 10% less
      setRadioButton(fixture, 'isRegistered', 'true');
      component.canContinue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture)).toContain('not eligible');

      // Not registered but income is 10% less
      setRadioButton(fixture, 'isRegistered', 'false');
      setRadioButton(fixture, 'isIncomeLess', 'true');
      component.continue();
      fixture.detectChanges();

      expect(getErrorMsg(fixture)).toContain('not eligible');
    }
  ));

  it('should coninue when eligibility requirements are satisfied', inject(
    [IncomeReviewDataService, Router],
    (mockDataService: MockDataService, mockRouter: MockRouter) => {
      mockDataService.informationCollectionNoticeConsent = true;

      setRadioButton(fixture, 'isRegistered', 'true');
      setRadioButton(fixture, 'isIncomeLess', 'true');

      expect(component.canContinue()).toBeTruthy();
      component.continue();
      expect(mockRouter.url).toBe(INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath);
    }
  ));
});
