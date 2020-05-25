import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { CollectionNoticeComponent } from '../../component/collection-notice/collection-notice.component';
import { environment } from '../../../../environments/environment';
import { UUID } from 'angular2-uuid';
import { IncomeReviewApiService } from '../../services/income-review-api.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fpir-home',
  templateUrl: './home.component.html',
})
export class HomeComponent extends BaseForm implements OnInit, AfterViewInit {
  @ViewChild('infoCollectionModal', { static: true })
  infoCollectionModal: CollectionNoticeComponent;

  // Value never changed, but can be read outside class
  readonly captchaApiUrl = environment.api.captchaBaseURL;
  readonly mspSuppBenefits = environment.links.mspSuppBenefits;

  // Use the UUID as a cryptographic client nonce to avoid replay attacks.
  nonce: string = UUID.UUID();

  // Radio button questions
  isRegisteredQuestion: string = 'Are you registered for Fair PharmaCare?';
  isIncomeLessQuestion: string =
    'Is your net income for last year or this year at least 10% less than your income from two years ago?';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private incomeReviewApiService: IncomeReviewApiService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get hasConsent() {
    return this.incomeReviewDataService.informationCollectionNoticeConsent;
  }

  get isEligible() {
    return (
      this.incomeReviewDataService.isRegistered &&
      this.incomeReviewDataService.isIncomeLess
    );
  }

  get isTouched() {
    let _touched =
      this.formGroup.controls.isRegistered.value !== null &&
      this.formGroup.controls.isIncomeLess.value !== null;

    if (_touched) {
      _touched =
        this.formGroup.controls.isRegistered.touched &&
        this.formGroup.controls.isIncomeLess.touched;
    }

    return _touched;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.fb.group({
      isRegistered: [
        this.incomeReviewDataService.isRegistered,
        Validators.required,
      ],
      isIncomeLess: [
        this.incomeReviewDataService.isIncomeLess,
        Validators.required,
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscrib to value changes
    this.formGroup.controls.isRegistered.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.isRegistered = val)
    );
    this.formGroup.controls.isIncomeLess.valueChanges.subscribe(
      (val) => (this.incomeReviewDataService.isIncomeLess = val)
    );

    // Individual has not consented to collection notice
    if (!this.incomeReviewDataService.informationCollectionNoticeConsent) {
      this.infoCollectionModal.openModal();
    }
  }

  setToken(token: string): void {
    this.incomeReviewApiService.setCaptchaToken(token);
    this.incomeReviewDataService.informationCollectionNoticeConsent = true;
  }

  continue() {
    this.markAllInputsTouched();
    if (
      this.canContinue() &&
      this.incomeReviewDataService.informationCollectionNoticeConsent &&
      this.isEligible
    ) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }
}
