import { Component, OnInit } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import {
  FORM_SUBMIT_LABEL,
  INCOME_REVIEW_PAGES,
} from '../../income-review.constants';

@Component({
  selector: 'fpir-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent extends BaseForm implements OnInit {
  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService
  ) {
    super(router, containerService, pageStateService);
  }

  ngOnInit() {
    // Override BaseForm init method
    this.containerService.setSubmitLabel(FORM_SUBMIT_LABEL);
    this.containerService.setUseDefaultColor(false);
  }

  continue() {
    this.navigate(INCOME_REVIEW_PAGES.CONFIRMATION.fullpath);
  }
}
