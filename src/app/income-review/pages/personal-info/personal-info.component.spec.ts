import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoComponent } from './personal-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockDataService {
  hasSpouse: boolean = true;
}

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let fixture: ComponentFixture<PersonalInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not be able to continue when no data entered (no spouse)', () => {
    expect(component.canContinue()).toBeFalsy();
    component.continue();
    fixture.detectChanges();
    expect(
      component.formGroup.controls.firstName.hasError('required')
    ).toBeTruthy();
    expect(
      component.formGroup.controls.lastName.hasError('required')
    ).toBeTruthy();
    expect(
      component.formGroup.controls.address.hasError('required')
    ).toBeTruthy();
    expect(component.formGroup.controls.city.hasError('required')).toBeTruthy();
    expect(
      component.formGroup.controls.postalCode.hasError('required')
    ).toBeTruthy();
    expect(component.formGroup.controls.phn.hasError('required')).toBeTruthy();
    expect(
      component.formGroup.controls.hasSpouse.hasError('required')
    ).toBeTruthy();

    // No spouse - fields have no validators set therefore should be valid
    expect(component.formGroup.controls.spFirstName.valid).toBeTruthy();
    expect(component.formGroup.controls.spLastName.valid).toBeTruthy();
    expect(component.formGroup.controls.spPhn.valid).toBeTruthy();
  });
});
