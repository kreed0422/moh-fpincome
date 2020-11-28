import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  incomeLineNumber: number = 1;
  spouseIncomeLineNumber: number = 2;
  rdspLineNumber: number = this.incomeLineNumber + 1;
  spouseRdspLineNumber: number = this.rdspLineNumber + 1;

  updateIncomeTotalValue: boolean = false;

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
    return this.incomeReviewDataService.incomeHeading;
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
    return this.incomeReviewDataService.incomeLabel;
  }

  get spouseIncomeLabel() {
    return this.incomeReviewDataService.spouseIncomeLabel;
  }

  get incomeTotalLabel() {
    return this.incomeReviewDataService.incomeTotalLabel;
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

    if (this.hasSpouse) {
      this.rdspLineNumber = this.rdspLineNumber + this.spouseIncomeLineNumber;
      this.spouseRdspLineNumber = this.rdspLineNumber + 1;
    }

    this.formGroup = this.fb.group({
      isLastYearIncome: [
        this.incomeReviewDataService.isLastYearIncome,
        { validators: Validators.required },
      ],
      income: [
        this.incomeReviewDataService.applicant.incomeStr,
        { validators: Validators.required, updateOn: 'blur' },
      ],
      spouseIncome: [
        this.incomeReviewDataService.spouse.incomeStr,
        {
          validators: this.hasSpouse ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      incomeTotal: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.incomeTotal,
            false
          ),
          disabled: true,
        },
      ],
    });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    // subscribe to value changes
    this.formGroup.controls.isLastYearIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.isLastYearIncome = val;
      this.resetIncome();
    });

    this.formGroup.controls.income.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.incomeStr = val;
      this.updateIncomeTotal();
    });

    this.formGroup.controls.spouseIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.incomeStr = val;
      this.updateIncomeTotal();
    });
  }

  continue() {
    this.markAllInputsTouched();

    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }

  updateIncomeTotal() {
    if (this.hasSpouse) {
      const _income = this.incomeReviewDataService.formatIncomeTotal(
        this.incomeReviewDataService.incomeTotal,
        false
      );
      this.formGroup.controls.incomeTotal.setValue(_income);
    }
  }

  resetIncome() {
    // Change will cause income to reset
    if (
      this.incomeReviewDataService.applicant.incomeStr !== undefined &&
      this.incomeReviewDataService.applicant.incomeStr !== null
    ) {
      this.incomeReviewDataService.applicant.clearIncome();
    }

    if (
      this.incomeReviewDataService.spouse.incomeStr !== undefined &&
      this.incomeReviewDataService.spouse.incomeStr !== null
    ) {
      this.incomeReviewDataService.spouse.clearIncome();
    }

    // Reset flags on control
    this.formGroup.controls.income.reset();
    this.formGroup.controls.spouseIncome.reset();

    // RDSP values -TODO
  }
}
