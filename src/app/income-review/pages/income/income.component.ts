import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'fpir-income',
  templateUrl: './income.component.html',
})
export class IncomeComponent extends BaseForm implements OnInit, AfterViewInit {
  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get applSectionTitle() {
    return this.incomeReviewDataService.applSectionTitle;
  }

  get spSectionTitle() {
    return this.incomeReviewDataService.spSectionTitle;
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  get originalIncomeLabel() {
    return this.incomeReviewDataService.originalIncomeLabel;
  }

  get reducedIncomeLabel() {
    return this.incomeReviewDataService.reducedIncomeLabel;
  }

  get remainderIncomeLabel() {
    return this.incomeReviewDataService.remainderIncomeLabel;
  }

  get line1to3Label() {
    return this.hasSpouse
      ? this.incomeReviewDataService.subtotalLabelLine1to3
      : this.incomeReviewDataService.totalLabelLine1to3;
  }

  get line5to7Label() {
    return this.incomeReviewDataService.subtotalLabelLine5to7;
  }

  get line4and8Label() {
    return this.incomeReviewDataService.totalLabelLine4and8;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.fb.group({
      originalIncome: [
        this.incomeReviewDataService.applicant.originalIncome,
        { updateOn: 'blur' },
      ],
      reducedIncome: [
        this.incomeReviewDataService.applicant.reducedIncome,
        { updateOn: 'blur' },
      ],
      remainderIncome: [
        this.incomeReviewDataService.applicant.remainderIncome,
        { updateOn: 'blur' },
      ],
      subtotal: [
        {
          value: this.incomeReviewDataService.applicant.incomeSubTotal,
          disabled: true,
        },
      ],

      spOriginalIncome: [
        this.incomeReviewDataService.spouse.originalIncome,
        { updateOn: 'blur' },
      ],
      spReducedIncome: [
        this.incomeReviewDataService.spouse.reducedIncome,
        { updateOn: 'blur' },
      ],
      spRemainderIncome: [
        this.incomeReviewDataService.spouse.remainderIncome,
        { updateOn: 'blur' },
      ],
      spSubtotal: [
        {
          value: this.incomeReviewDataService.spouse.incomeSubTotal,
          disabled: true,
        },
      ],

      total: [
        { value: this.incomeReviewDataService.incomeTotal, disabled: true },
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.originalIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.originalIncome = val;
      this.updateTotals();
    });

    this.formGroup.controls.reducedIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.reducedIncome = val;
      this.updateTotals();
    });

    this.formGroup.controls.remainderIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.remainderIncome = val;
      this.updateTotals();
    });

    this.formGroup.controls.spOriginalIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.originalIncome = val;
      this.updateTotals();
    });

    this.formGroup.controls.spReducedIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.reducedIncome = val;
      this.updateTotals();
    });

    this.formGroup.controls.spRemainderIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.remainderIncome = val;
      this.updateTotals();
    });
  }

  continue() {
    this.markAllInputsTouched();

    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.SUPPORT_DOCS.fullpath);
    }
  }

  updateTotals() {
    this.formGroup.controls.subtotal.setValue(
      this.incomeReviewDataService.applicant.incomeSubTotal
    );

    if (this.hasSpouse) {
      this.formGroup.controls.spSubtotal.setValue(
        this.incomeReviewDataService.spouse.incomeSubTotal
      );
      this.formGroup.controls.total.setValue(
        this.incomeReviewDataService.incomeTotal
      );
    }
  }
}
