import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import {
  ContainerService,
  PageStateService,
  commonValidatePostalcode,
} from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';

@Component({
  selector: 'fpir-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent extends BaseForm
  implements OnInit, AfterViewInit {
  readonly firstNameLen = 20;
  readonly lastNameLen = 35;
  readonly applFirstNameLabel = 'First name';
  readonly applLastNameLabel = 'Last name';
  readonly applAddressLabel = 'Address';
  readonly phnLabel = 'PHN';
  readonly spFirstNameLabel = 'Spouse first name';
  readonly spLastNameLabel = 'Spouse last name';
  readonly spPhnLabel = 'Spouse PHN';
  readonly hasSpouseQuestion = 'Do you have a spouse / common law partner?';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasSpouseFlag() {
    return this.incomeReviewDataService.hasSpouse;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.fb.group({
      firstName: [
        this.incomeReviewDataService.applicant.firstName,
        Validators.required,
      ],
      lastName: [
        this.incomeReviewDataService.applicant.lastName,
        Validators.required,
      ],
      address: [
        this.incomeReviewDataService.address.addressLine1,
        Validators.required,
      ],
      city: [this.incomeReviewDataService.address.city, Validators.required],
      postalCode: [
        this.incomeReviewDataService.address.postal,
        [Validators.required, commonValidatePostalcode(true, true)],
      ],
      phn: [this.incomeReviewDataService.applicant.phn, Validators.required],
      hasSpouse: [this.incomeReviewDataService.hasSpouse, Validators.required],
      spFirstName: [
        this.incomeReviewDataService.spouse.firstName,
        Validators.required,
      ],
      spLastName: [
        this.incomeReviewDataService.spouse.lastName,
        Validators.required,
      ],
      spPhn: [this.incomeReviewDataService.spouse.phn, Validators.required],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.firstName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.firstName = val)
    );
    this.formGroup.controls.lastName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.lastName = val)
    );
    this.formGroup.controls.address.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.addressLine1 = val)
    );
    this.formGroup.controls.city.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.city = val)
    );
    this.formGroup.controls.postalCode.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.address.postal = val)
    );
    this.formGroup.controls.phn.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.applicant.phn = val)
    );
    this.formGroup.controls.hasSpouse.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.hasSpouse = val)
    );
    this.formGroup.controls.spFirstName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.firstName = val)
    );
    this.formGroup.controls.spLastName.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.lastName = val)
    );
    this.formGroup.controls.spPhn.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouse.phn = val)
    );
  }

  continue() {
    this.markAllInputsTouched();

    this.formGroup.updateValueAndValidity({ onlySelf: false });

    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }
}
