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
} from '../../../_developmentHelpers/test-helpers';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { Component, Injectable } from '@angular/core';

@Component({
  template: ` <p>Mock Personal Page</p> `,
})
class MockPersonalInfoComponent {
  constructor() {}
}

@Injectable()
class MockDataService {
  isRegistered: boolean;
  isIncomeLess: boolean;
  informationCollectionNoticeConsent: boolean = true;
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
      declarations: [
        HomeComponent,
        CollectionNoticeComponent,
        MockPersonalInfoComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: INCOME_REVIEW_PAGES.HOME.fullpath,
            component: HomeComponent,
          },
          {
            path: INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath,
            component: MockPersonalInfoComponent,
          },
        ]),
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
    fixture.whenStable().then(() => {
      const button = getCollectionNoticeButton(fixture);
      expect(button.nativeElement.disabled).toBeFalsy();

      button.nativeElement.click();
      fixture.whenStable().then(() => {
        const dialog = getDebugElement(
          fixture,
          'fpir-collection-notice .modal'
        );
        expect(dialog.nativeElement.visable).toBeFalsy();
      });
    });
  });

  // Logic test for continuing
  it('should display required error when mandatory fields are empty', inject(
    [IncomeReviewDataService],
    (useClass: MockDataService) => {
      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.whenStable().then(() => {
        const isRegisteredError = getRadioErrorMsg(fixture, 'isRegistered');
        expect(isRegisteredError).toContain('required');

        const isIncomeLessError = getRadioErrorMsg(fixture, 'isIncomeLess');
        expect(isIncomeLessError).toContain('required');
      });
    }
  ));

  it('should display not eligible when requirements are not satisfied', inject(
    [IncomeReviewDataService],
    (useClass: MockDataService) => {
      // Not registered and income is not 10% less
      setRadioButton(fixture, 'isRegistered', 'false');
      setRadioButton(fixture, 'isIncomeLess', 'false');
      component.continue();

      fixture.whenStable().then(() => {
        let error = getErrorMsg(fixture);
        expect(error).toContain('not eligible');

        // Registered but income not 10% less
        setRadioButton(fixture, 'isRegistered', 'true');
        component.canContinue();

        fixture.whenStable().then(() => {
          error = getErrorMsg(fixture);
          expect(error).toContain('not eligible');

          // Not registered but income is 10% less
          setRadioButton(fixture, 'isRegistered', 'false');
          setRadioButton(fixture, 'isIncomeLess', 'true');
          component.continue();

          fixture.whenStable().then(() => {
            error = getErrorMsg(fixture);
            expect(error).toContain('not eligible');
          });
        });
      });
    }
  ));

  it('should coninue when eligibility requirements are satisfied', inject(
    [IncomeReviewDataService],
    (useClass: MockDataService) => {
      setRadioButton(fixture, 'isRegistered', 'true');
      setRadioButton(fixture, 'isIncomeLess', 'true');
      expect(component.canContinue()).toBeTruthy();
      component.continue();
    }
  ));
});
