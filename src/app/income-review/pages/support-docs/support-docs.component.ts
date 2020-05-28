import { Component, OnInit } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { Router } from '@angular/router';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder } from '@angular/forms';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';

@Component({
  selector: 'fpir-support-docs',
  templateUrl: './support-docs.component.html',
  styleUrls: ['./support-docs.component.scss'],
})
export class SupportDocsComponent extends BaseForm implements OnInit {
  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  continue() {
    this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
  }
}
