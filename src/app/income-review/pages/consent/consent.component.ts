import { Component, OnInit, AfterViewInit } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  FORM_SUBMIT_LABEL,
  INCOME_REVIEW_PAGES,
} from '../../income-review.constants';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fpir-consent',
  templateUrl: './consent.component.html',
})
export class ConsentComponent extends BaseForm
  implements OnInit, AfterViewInit {
  registrantConsentStmt: string =
    'I consent [Registrant Name} more text here....';
  spouseConsentStmt: string =
    'I consent [Signature of Spouse/ Common-Law partner] more text here....';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  /**
   * NOTE: Work-around until checkbox component is fixed in library, not compatiable with reactive forms
   */
  get isChecked() {
    let _isChecked = !!this.incomeReviewDataService.registrantConsent;

    if (this.hasSpouse) {
      _isChecked = _isChecked && !!this.incomeReviewDataService.spouseConsent;
    }
    return _isChecked;
  }

  get isTouched() {
    let _isTouched = this.formGroup.controls.registrantConsent.touched;
    if (this.hasSpouse) {
      _isTouched = _isTouched && this.formGroup.controls.spouseConsent.touched;
    }
    return _isTouched;
  }

  ngOnInit() {
    // Override BaseForm init method
    this.containerService.setSubmitLabel(FORM_SUBMIT_LABEL);
    this.containerService.setUseDefaultColor(false);

    this.formGroup = this.fb.group({
      registrantConsent: [
        this.incomeReviewDataService.registrantConsent,
        Validators.required,
      ],
      spouseConsent: [
        this.incomeReviewDataService.spouseConsent,
        Validators.required,
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscrib to value changes
    this.formGroup.controls.registrantConsent.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.registrantConsent = val)
    );
    this.formGroup.controls.spouseConsent.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.spouseConsent = val)
    );
  }

  continue() {
    this.markAllInputsTouched();

    /**
     * NOTE: Work-around until checkbox component is fixed in library, not compatiable with reactive forms
     */
    if (this.canContinue() && this.isChecked) {
      this.navigate(INCOME_REVIEW_PAGES.CONFIRMATION.fullpath);
    }
  }
}
