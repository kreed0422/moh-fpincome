import { Component, OnInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'fpir-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent extends BaseForm implements OnInit {
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
    this.navigate(INCOME_REVIEW_PAGES.SUPPORT_DOCS.fullpath);
  }
}
