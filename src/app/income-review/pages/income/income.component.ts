import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'fpir-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
})
export class IncomeComponent extends BaseForm implements OnInit, AfterViewInit {
  readonly incomeStmt = environment.links.incomeStmt;
  readonly incomeOptions = [
    { label: `Applying with last year's net income`, value: true },
    { label: `Applying with this year's gross income`, value: false },
  ];

  readonly netIncomeInstruct =
    `<div>Use information from your CRA Notice of Assessment or Notice of Reassessment or ` +
    `<a href="${this.incomeStmt}" target="_blank" rel="noopener noreferrer">proof of income statement</a> ` +
    `for last year.</div>` +
    `<div>Haven't filed your taxes yet? If you are applying after June 1, you must provide your CRA Notice ` +
    `of Assessment. If you are applying before June 1, provide T-slips and other income records.</div>`;

  readonly grossIncomeInstruct =
    '<p><strong>Estimate your gross income for the current calendar year.</strong></p>' +
    '<p>Add up all amounts that you and your spouse have received this year and expect to receive from all sources. ' +
    'This will be your gross income.</p>';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private fb: FormBuilder
  ) {
    super(router, containerService, pageStateService);
  }

  get isLastYearIncome() {
    return this.incomeReviewDataService.isLastYearIncome;
  }

  set isLastYearIncome(lastYearIncome: boolean) {
    this.incomeReviewDataService.isLastYearIncome = lastYearIncome;
  }

  get showSection() {
    return (
      this.incomeReviewDataService.isLastYearIncome !== undefined &&
      this.incomeReviewDataService.isLastYearIncome !== null
    );
  }

  get incomeHeading() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? this.incomeReviewDataService.lastYearIncome
      : this.incomeReviewDataService.currentYearIncome;
  }

  get incomeInstruction() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? this.netIncomeInstruct
      : this.grossIncomeInstruct;
  }

  get arialLabelBy() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? 'NetIncome'
      : 'GrossIncome';
  }

  get incomeLabel() {
    const _label =
      this.incomeReviewDataService.isLastYearIncome === true
        ? this.incomeReviewDataService.netIncomeLabel
        : this.incomeReviewDataService.grossIncomeLabel;

    return _label;
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  get moneyMask() {
    return this.incomeReviewDataService.incomeInputMask;
  }

  get moneyTotalMask() {
    return this.incomeReviewDataService.incomeDisplayMask;
  }

  ngOnInit() {
    super.ngOnInit();
    this.formGroup = this.fb.group({
      isLastYearIncome: [
        this.incomeReviewDataService.isLastYearIncome,
        { validators: Validators.required },
      ],
      income: [
        this.incomeReviewDataService.applicant.income,
        { validators: Validators.required, updateOn: 'blur' },
      ],

      /*  originalIncome: [
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
      ],*/
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.isLastYearIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.isLastYearIncome = val;
    });

    this.formGroup.controls.income.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.income = val;
    });

    /*  this.formGroup.controls.originalIncome.valueChanges.subscribe((val) => {
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
    });*/
  }

  continue() {
    this.markAllInputsTouched();

    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }

  updateTotals() {
    let _income = this.incomeReviewDataService.formatIncomeTotal(
      this.incomeReviewDataService.applicant.incomeSubTotal,
      false
    );
    this.formGroup.controls.subtotal.setValue(_income);

    if (this.hasSpouse) {
      _income = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.spouse.incomeSubTotal,
        false
      );
      this.formGroup.controls.spSubtotal.setValue(_income);
      _income = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.incomeTotal,
        false
      );
      this.formGroup.controls.total.setValue(_income);
    }
  }

  private _stripHtml(label: string) {
    const text = label.replace(/(?:<strong>|<\/strong>)/g, '');
    return text.replace(/<br>/g, ' ');
  }
}
