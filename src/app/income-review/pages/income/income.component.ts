import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'fpir-income',
  templateUrl: './income.component.html',
})
export class IncomeComponent extends BaseForm implements OnInit, AfterViewInit {
  decimalPipeMask = (value: any) => {
    if (!isNaN(value)) {
      return Number(value).toFixed(2);
    }
    return value;
    // tslint:disable-next-line: semicolon
  };

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

  get moneyMask() {
    return this.incomeReviewDataService.incomeInputMask;
  }

  get moneyTotalMask() {
    return this.incomeReviewDataService.incomeDisplayMask;
  }

  get originalIncomeErrorMsg() {
    return `${this._stripHtml(
      this.incomeReviewDataService.originalIncomeLabel
    )} is required`;
  }
  get reducedIncomeErrorMsg() {
    return `${this._stripHtml(this.reducedIncomeLabel)} is required`;
  }
  get remainderIncomeErrorMsg() {
    return `${this._stripHtml(this.remainderIncomeLabel)} is required`;
  }

  get originalIncomeHasError() {
    const ctrl = this.formGroup.controls.originalIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }
  get reducedIncomeHasError() {
    const ctrl = this.formGroup.controls.reducedIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }
  get remainderIncomeHasError() {
    const ctrl = this.formGroup.controls.remainderIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }

  get spOriginalIncomeHasError() {
    const ctrl = this.formGroup.controls.spOriginalIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }
  get spReducedIncomeHasError() {
    const ctrl = this.formGroup.controls.spReducedIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }
  get spRemainderIncomeHasError() {
    const ctrl = this.formGroup.controls.spRemainderIncome;
    return ctrl.hasError('required') && ctrl.touched;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.fb.group({
      originalIncome: [
        this.incomeReviewDataService.applicant.originalIncome,
        { validators: Validators.required, updateOn: 'blur' },
      ],
      reducedIncome: [
        this.incomeReviewDataService.applicant.reducedIncome,
        { validators: Validators.required, updateOn: 'blur' },
      ],
      remainderIncome: [
        this.incomeReviewDataService.applicant.remainderIncome,
        { validators: Validators.required, updateOn: 'blur' },
      ],
      subtotal: [
        {
          value: this.incomeReviewDataService.applicant.incomeSubTotal,
          disabled: true,
        },
      ],

      spOriginalIncome: [
        this.incomeReviewDataService.spouse.originalIncome,
        {
          validators: this.hasSpouse ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      spReducedIncome: [
        this.incomeReviewDataService.spouse.reducedIncome,
        {
          validators: this.hasSpouse ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      spRemainderIncome: [
        this.incomeReviewDataService.spouse.remainderIncome,
        {
          validators: this.hasSpouse ? Validators.required : null,
          updateOn: 'blur',
        },
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
      this.incomeReviewDataService.applicant.originalIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
      this.updateTotals();
    });

    this.formGroup.controls.reducedIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.reducedIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
      this.updateTotals();
    });

    this.formGroup.controls.remainderIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.remainderIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
      this.updateTotals();
    });

    this.formGroup.controls.spOriginalIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.originalIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
      this.updateTotals();
    });

    this.formGroup.controls.spReducedIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.reducedIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
      this.updateTotals();
    });

    this.formGroup.controls.spRemainderIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.remainderIncome = this.incomeReviewDataService.currencyStrToNumber(
        val
      );
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

  private _stripHtml(label: string) {
    const text = label.replace(/(?:<strong>|<\/strong>)/g, '');
    return text.replace(/<br>/g, ' ');
  }
}
