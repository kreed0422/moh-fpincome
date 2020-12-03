import { Component, OnInit, AfterViewInit } from '@angular/core';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SupportDocType } from '../support-docs/support-doc-type.enum';

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

  get supportDocCase() {
    if (this.hasSpouse) {
      if (this.isLastYearIncome) {
        return SupportDocType.SpouseLastYear;
      } else {
        return SupportDocType.SpouseThisYear;
      }
    } else {
      if (this.isLastYearIncome) {
        return SupportDocType.NoSpouseLastYear;
      } else {
        return SupportDocType.NoSpouseThisYear;
      }
    }
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

  get ariaLabelIncome() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? 'NetIncome'
      : 'GrossIncome';
  }

  get ariaLabelSpouseIncome() {
    return this.incomeReviewDataService.isLastYearIncome === true
      ? 'SpouseNetIncome'
      : 'SpouseGrossIncome';
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

  get rdspIncomeLabel() {
    return this.incomeReviewDataService.rdspIncomeLabel;
  }

  get spouseRdspIncomeLabel() {
    return `spouse's ${this.incomeReviewDataService.rdspIncomeLabel}`;
  }

  get rdspIncomeTotalLabel() {
    return this.incomeReviewDataService.rdspIncomeTotalLabel;
  }

  get netIncomeMinusRdspLabel() {
    return this.hasSpouse
      ? this.incomeReviewDataService.spouseNetIncomeMinusRdspLabel
      : this.incomeReviewDataService.netIncomeMinusRdspLabel;
  }

  get hasSpouse() {
    return this.incomeReviewDataService.hasSpouse;
  }

  get hasRdspIncome() {
    return this.incomeReviewDataService.hasRdspIncome;
  }

  get moneyMask() {
    return this.incomeReviewDataService.incomeInputMask;
  }

  get moneyTotalMask() {
    return this.incomeReviewDataService.incomeDisplayMask;
  }

  get incomeTotalLineNo() {
    return (
      this.incomeLineNumber + (this.hasSpouse ? this.spouseIncomeLineNumber : 1)
    );
  }

  get rdspLineNo() {
    return this.incomeTotalLineNo + 1;
  }

  get spouseRdspLineNo() {
    return this.rdspLineNo + 1;
  }

  get totalRspdLineNo() {
    return this.spouseRdspLineNo + 1;
  }

  get netInomeMinusRdspLineNo() {
    return (this.hasSpouse ? this.totalRspdLineNo : this.rdspLineNo) + 1;
  }

  ngOnInit() {
    super.ngOnInit();

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
      hasRdspIncome: [
        this.incomeReviewDataService.hasRdspIncome,
        {
          validators: this.isLastYearIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      rdspIncome: [
        this.incomeReviewDataService.applicant.rdspIncomeStr,
        {
          validators: this.hasRdspIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      spouseRdspIncome: [
        this.incomeReviewDataService.spouse.rdspIncomeStr,
        {
          validators:
            this.hasSpouse && this.hasRdspIncome ? Validators.required : null,
          updateOn: 'blur',
        },
      ],
      rdspIncomeTotal: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.rdspIncomeTotal,
            false
          ),
          disabled: true,
        },
      ],
      netIncomeMinusRdsp: [
        {
          value: this.incomeReviewDataService.formatIncomeTotal(
            this.incomeReviewDataService.netIncomeTotal,
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

    this.formGroup.controls.hasRdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.hasRdspIncome = val;
      this.resetRsdpIncome();

      if (val === true) {
        this.updateRsdpIncome();
      }
    });

    this.formGroup.controls.rdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.applicant.rdspIncomeStr = val;
      this.updateIncomeTotal();
    });

    this.formGroup.controls.spouseRdspIncome.valueChanges.subscribe((val) => {
      this.incomeReviewDataService.spouse.rdspIncomeStr = val;
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

    // RDSP income
    if (this.isLastYearIncome && this.hasRdspIncome) {
      this.updateRsdpIncome();
    }
  }

  resetRsdpIncome() {
    this.incomeReviewDataService.applicant.rdspIncomeStr = undefined;
    this.incomeReviewDataService.spouse.rdspIncomeStr = undefined;

    this.formGroup.controls.rdspIncomeTotal.reset();
    this.formGroup.controls.netIncomeMinusRdsp.reset();
  }

  updateRsdpIncome() {
    const _rdspIncome = this.incomeReviewDataService.formatIncomeTotal(
      this.incomeReviewDataService.rdspIncomeTotal,
      false
    );
    this.formGroup.controls.rdspIncomeTotal.setValue(_rdspIncome);

    const _netIncome = this.incomeReviewDataService.formatIncomeTotal(
      this.incomeReviewDataService.netIncomeTotal,
      false
    );
    this.formGroup.controls.netIncomeMinusRdsp.setValue(_netIncome);
  }

  resetIncome() {
    // Change will cause income to reset
    this.incomeReviewDataService.applicant.clearIncome();
    this.incomeReviewDataService.spouse.clearIncome();

    // Reset flags on control
    this.formGroup.controls.income.reset();
    this.formGroup.controls.spouseIncome.reset();
  }
}
