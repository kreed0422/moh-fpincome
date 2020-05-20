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

@Component({
  selector: 'fpir-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends BaseForm implements OnInit, AfterViewInit {
  @ViewChild('infoCollectionModal', { static: true })
  infoCollectionModal: CollectionNoticeComponent;

  // Value never changed, but can be read outside class
  readonly captchaApiUrl = environment.api.captchaURL;

  // Use the UUID as a cryptographic client nonce to avoid replay attacks.
  nonce: string = UUID.UUID();

  private _hasToken: boolean = false;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private incomeReviewApiService: IncomeReviewApiService
  ) {
    super(router, containerService, pageStateService);
  }

  get hasConsent() {
    return this.incomeReviewDataService.informationCollectionNoticeConsent;
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // Individual has not consented to collection notice
    if (!this.incomeReviewDataService.informationCollectionNoticeConsent) {
      this.infoCollectionModal.openModal();
    }
  }

  setToken(token: string): void {
    this._hasToken = true;
    this.incomeReviewApiService.setCaptchaToken(token);
    this.incomeReviewDataService.informationCollectionNoticeConsent = true;
  }

  continue() {
    console.log('continue ');
    this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
  }
}
