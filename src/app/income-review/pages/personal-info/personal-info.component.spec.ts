import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  getDebugElement,
  setInput,
  clickRadioButton,
} from '../../../_developmentHelpers/test-helpers';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { Component } from '@angular/core';

@Component({
  selector: 'fpir-mock',
  template: ` <p>Mock Income Page</p> `,
})
class MockIncomeComponent {}
class MockDataService {
  hasSpouse: boolean = true;
}

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent, MockIncomeComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          {
            path: INCOME_REVIEW_PAGES.INCOME.fullpath,
            component: MockIncomeComponent,
          },
        ]),
        SharedCoreModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be able to continue when no data entered (no spouse)', () => {
    expect(component.canContinue()).toBeFalsy();
    component.continue();
    fixture.whenStable().then(() => {
      expect(
        component.formGroup.controls.firstName.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.lastName.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.address.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.city.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.postalCode.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.phn.hasError('required')
      ).toBeTruthy();
      expect(
        component.formGroup.controls.hasSpouse.hasError('required')
      ).toBeTruthy();

      // No spouse - fields have no validators set therefore should be valid
      expect(component.formGroup.controls.spFirstName.valid).toBeTruthy();
      expect(component.formGroup.controls.spLastName.valid).toBeTruthy();
      expect(component.formGroup.controls.spPhn.valid).toBeTruthy();

      // Should not appear
      const spFirstName = getDebugElement(
        fixture,
        'common-name',
        'spFirstName'
      );
      const spLastName = getDebugElement(fixture, 'common-name', 'spLastName');
      const spPhn = getDebugElement(fixture, 'common-phn', 'spPhn');
      expect(spFirstName).toBeNull();
      expect(spLastName).toBeNull();
      expect(spPhn).toBeNull();
    });
  });

  it('should be able to continue when data entered (no spouse)', () => {
    // Retrieve elements on page
    const firstName = getDebugElement(fixture, 'common-name', 'firstName');
    const lastName = getDebugElement(fixture, 'common-name', 'lastName');
    const phn = getDebugElement(fixture, 'common-phn', 'phn');
    const address = getDebugElement(fixture, 'common-street', 'address');
    const city = getDebugElement(fixture, 'common-city', 'city');
    const postalCode = getDebugElement(
      fixture,
      'common-postal-code',
      'postalCode'
    );
    const hasSpouse = getDebugElement(fixture, 'common-radio', 'hasSpouse');

    // Set input value
    setInput(firstName, firstName.componentInstance.labelforId, 'Applicant');
    setInput(lastName, lastName.componentInstance.labelforId, 'Test');
    setInput(phn, phn.componentInstance.labelforId, '9999 999 998');
    setInput(address, address.componentInstance.labelforId, '123 York Street');
    setInput(city, city.componentInstance.labelforId, 'Victoria');
    setInput(postalCode, postalCode.componentInstance.labelforId, 'V9V 9V9');
    clickRadioButton(hasSpouse, 'false');

    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeTruthy();

      fixture.ngZone.run(() => component.continue());

      // TODO: Figure out who to detect route url - need to do this for all tests
    });
  });
});
