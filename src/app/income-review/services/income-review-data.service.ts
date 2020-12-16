import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ReviewObject } from '../component/review-container/review-container.component';
import { ServerPayload } from '../models/review-income-api';
import { formatISO } from 'date-fns';
import { Person, Address, CommonImage } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../income-review.constants';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { conformToMask } from 'angular2-text-mask';

export const createCurrencyMask = (opts = {}) => {
  const numberMask = createNumberMask({
    allowDecimal: true,
    requireDecimal: true,
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    decimalSymbol: '.',
    decimalLimit: 2,
    ...opts,
  });

  return (rawValue) => {
    const mask = numberMask(rawValue);
    return mask;
  };
};

export enum FpcDocumentTypes {
  SupportDocument = 'SUPPORTDOCUMENT',
}

export class Registrant extends Person {
  phn: string;

  // consent declaration
  consent: boolean = false;

  incomeStr: string;
  rdspIncomeStr: string;

  clearIncome() {
    this.incomeStr = undefined;
    this.rdspIncomeStr = undefined;
  }
}

@Injectable({
  providedIn: 'root',
})
export class IncomeReviewDataService {
  /**
   * Application UUID sent in JSON message
   * TODO: Discussion with Jam how we want to do this (i.e. like MSP or FPCARE)
   *       Should be like MSP <URL>/UUID - may need new service in Openshift
   */
  readonly applicationUUID: string = UUID.UUID();

  // Labels for calculate income, review and confirmation pages

  // Current Year's income field headings
  readonly currentYearIncome = `This Year's Gross Income`;
  readonly grossIncomeLabel = 'gross income for this year:';
  readonly grossIncomeTotalLabel = 'total gross income (lines 1 + 2):';

  // Last Year's income field headings - TODO css  => p.capitalize {text-transform: capitalize};
  readonly lastYearIncome = `Last Year's Net Income`;
  readonly netIncomeLabel = 'net income for last year (from line 23600):';
  readonly rdspIncomeLabel = 'RDSP income (from line 12500):';
  readonly rdspIncomeTotalLabel = 'Total RDSP income (lines 4 + 5):';
  readonly netIncomeMinusRdspLabel =
    'Net income minus RDSP payments (lines 1 - 2):';
  readonly spouseNetIncomeMinusRdspLabel =
    'Net income minus RDSP payments (lines 3 - 6):';
  readonly netIncomeTotalLabel = 'total net income (lines 1 + 2):';

  // Labels for personal info, review, and confirmation pages
  readonly applFirstNameLabel = 'First name';
  readonly applLastNameLabel = 'Last name';
  readonly applAddressLabel = 'Address';
  readonly phnLabel = 'Personal Health Number (PHN)';
  readonly spFirstNameLabel = 'Spouse first name';
  readonly spLastNameLabel = 'Spouse last name';
  readonly spPhnLabel = 'Spouse Personal Health Number (PHN)';
  readonly applPostalCodeLabel = 'Postal code';

  dateOfSubmission: Date;

  informationCollectionNoticeConsent: boolean;

  // Infomation for income review process
  isRegistered: boolean;
  isIncomeLess: boolean;

  hasSpouse: boolean;

  // Flag to indicate this is for last year
  isLastYearIncome: boolean;

  // Flag to indicate RDSP Income
  hasRdspIncome: boolean;

  applicant: Registrant = new Registrant();
  spouse: Registrant = new Registrant();
  address: Address = new Address();

  // Income review support documents
  incomeSupportDocs: CommonImage<FpcDocumentTypes>[] = [];

  applicationResponse: ServerPayload;

  // Masks for displaying currency
  // TODO: Figure out how to display negative numbers
  private _incomeMask = createCurrencyMask({ integerLimit: 6, prefix: '' });
  private _incomeTotalMask = createCurrencyMask({
    integerLimit: 9,
    prefix: '',
  });

  // Payload for application
  get applicationPayload() {
    const payload = {
      applicationUUID: this.applicationUUID,

      fpcIncomeReview: {
        informationConsentAgreement: this.informationCollectionNoticeConsent,
        submissionDate: formatISO(new Date(), { representation: 'date' }),
        applicant: {
          firstName: this.applicant.firstName,
          lastName: this.applicant.lastName,
          phn: this._stripFormatting(this.applicant.phn),
          address: {
            street: this.address.addressLine1,
            city: this.address.city,
            postalCode: this._stripFormatting(this.address.postal),
          },
        },
        income: {
          applicantIncome: {
            income: this._currencyStrToNumber(this.applicant.incomeStr),
          },
          totalIncome: this.incomeTotal,
          lastYearIncome: this.isLastYearIncome,
        },
        applicantConsent: this.applicant.consent,
      },
    };

    if (this.isLastYearIncome) {
      payload.fpcIncomeReview.income.applicantIncome = Object.assign(
        payload.fpcIncomeReview.income.applicantIncome,
        {
          rdspIncome: this._currencyStrToNumber(this.applicant.rdspIncomeStr),
        }
      );

      payload.fpcIncomeReview.income = Object.assign(
        payload.fpcIncomeReview.income,
        {
          rdspTotal: this.rdspIncomeTotal,
          netTotal: this.netIncomeTotal,
        }
      );
    }

    if (this.hasSpouse) {
      payload.fpcIncomeReview.income = Object.assign(
        payload.fpcIncomeReview.income,
        this._getSpouseIncome()
      );
      payload.fpcIncomeReview = Object.assign(
        payload.fpcIncomeReview,
        this._getSpouse()
      );
    }
    return payload;
  }

  get incomeTotal() {
    let _income = this._currencyStrToNumber(this.applicant.incomeStr);
    if (this.hasSpouse) {
      _income += this._currencyStrToNumber(this.spouse.incomeStr);
    }
    return Number(_income.toFixed(2));
  }

  get rdspIncomeTotal() {
    let _rdsp = this._currencyStrToNumber(this.applicant.rdspIncomeStr);
    if (this.hasSpouse) {
      _rdsp += this._currencyStrToNumber(this.spouse.rdspIncomeStr);
    }
    return Number(_rdsp.toFixed(2));
  }

  get netIncomeTotal() {
    return this.incomeTotal - this.rdspIncomeTotal;
  }

  get incomeHeading() {
    return this.isLastYearIncome === true
      ? this.lastYearIncome
      : this.currentYearIncome;
  }

  get incomeLabel() {
    return this.isLastYearIncome === true
      ? this.netIncomeLabel
      : this.grossIncomeLabel;
  }

  get spouseIncomeLabel() {
    return this.isLastYearIncome === true
      ? `spouse's ${this.netIncomeLabel}`
      : `spouse's ${this.grossIncomeLabel}`;
  }

  get incomeTotalLabel() {
    return this.isLastYearIncome === true
      ? this.netIncomeTotalLabel
      : this.grossIncomeTotalLabel;
  }
  get totalNetIncomeLabel() {
    return this.hasSpouse
      ? this.spouseNetIncomeMinusRdspLabel
      : this.netIncomeMinusRdspLabel;
  }

  get incomeInputMask() {
    return this._incomeMask;
  }

  get incomeDisplayMask() {
    return this._incomeTotalMask;
  }

  constructor() {}

  formatIncomeTotal(value: number) {
    return this._currencyFormat(value, this._incomeTotalMask);
  }

  getPersonalInformationSection(printView: boolean = false): ReviewObject {
    const obj = {
      heading: 'Personal Information',
      isPrintView: printView,
      redirectPath: INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath,
      sectionItems: [
        {
          label: `${this.applFirstNameLabel}:`,
          value: this.applicant.firstName,
        },
        {
          label: `${this.applLastNameLabel}:`,
          value: this.applicant.lastName,
        },
        {
          label: `${this.applAddressLabel}:`,
          value: this.address.addressLine1,
        },
        { label: 'City:', value: this.address.city },
        {
          label: `${this.applPostalCodeLabel}:`,
          value: this.address.postal,
        },
        { label: `${this.phnLabel}:`, value: this.applicant.phn },
      ],
    };

    if (this.hasSpouse) {
      const spouseSection = [
        { label: `${this.spFirstNameLabel}:`, value: this.spouse.firstName },
        { label: `${this.spLastNameLabel}:`, value: this.spouse.lastName },
        { label: `${this.spPhnLabel}:`, value: this.spouse.phn },
      ];
      obj.sectionItems = obj.sectionItems.concat(spouseSection);
    }

    return obj;
  }

  getIncomeSection(printView: boolean = false): ReviewObject {
    let count = 1;
    const obj = {
      heading: this.incomeHeading,
      isPrintView: printView,
      isFinancialData: true,
      redirectPath: INCOME_REVIEW_PAGES.INCOME.fullpath,
      sectionItems: [
        {
          label: this.incomeLabel,
          value: this.applicant.incomeStr,
          extraInfo: {
            lineNo: `${count}`,
            mask: this.incomeInputMask,
            isTotal: false,
          },
        },
      ],
    };

    if (this.hasSpouse) {
      obj.sectionItems = obj.sectionItems.concat([
        {
          label: this.spouseIncomeLabel,
          value: this.spouse.incomeStr,
          extraInfo: {
            lineNo: `${(count += 1)}`,
            mask: this.incomeInputMask,
            isTotal: false,
          },
        },
        {
          label: this.incomeTotalLabel,
          value: this.incomeTotal.toFixed(2),
          extraInfo: {
            lineNo: `${(count += 1)}`,
            mask: this.incomeDisplayMask,
            isTotal: true,
          },
        },
      ]);
    }

    if (this.isLastYearIncome === true) {
      obj.sectionItems = obj.sectionItems.concat([
        {
          label: this.rdspIncomeLabel,
          value: this.applicant.rdspIncomeStr,
          extraInfo: {
            lineNo: `${(count += 1)}`,
            mask: this.incomeInputMask,
            isTotal: false,
          },
        },
      ]);

      if (this.hasSpouse) {
        obj.sectionItems = obj.sectionItems.concat([
          {
            label: `spouse's ${this.rdspIncomeLabel}`,
            value: this.spouse.rdspIncomeStr,
            extraInfo: {
              lineNo: `${(count += 1)}`,
              mask: this.incomeInputMask,
              isTotal: false,
            },
          },
          {
            label: this.rdspIncomeTotalLabel,
            value: this.rdspIncomeTotal.toFixed(2),
            extraInfo: {
              lineNo: `${(count += 1)}`,
              mask: this.incomeDisplayMask,
              isTotal: true,
            },
          },
        ]);
      }

      obj.sectionItems = obj.sectionItems.concat([
        {
          label: this.totalNetIncomeLabel,
          value: this.netIncomeTotal.toFixed(2),
          extraInfo: {
            lineNo: `${count + 1}`,
            mask: this.incomeDisplayMask,
            isTotal: true,
          },
        },
      ]);
    }
    return obj;
  }

  getSupportDocsSection(printView: boolean = false): ReviewObject {
    return {
      heading: 'Supporting Documents',
      isPrintView: printView,
      redirectPath: INCOME_REVIEW_PAGES.INCOME.fullpath,
      sectionItems: [
        {
          label: 'Documents uploaded:',
          value: `${this.incomeSupportDocs.length}`,
        },
      ],
    };
  }

  getAttachments(): CommonImage<FpcDocumentTypes>[] {
    const _documents = this.incomeSupportDocs;
    // update attachment order and document type
    _documents.forEach((x, idx) => {
      x.attachmentOrder = idx + 1;
      x.documentType = FpcDocumentTypes.SupportDocument;
    });

    return _documents;
  }

  private _currencyStrToNumber(strValue: string): number {
    let _value = 0;

    if (strValue) {
      let str = strValue.replace(/,/g, '');
      str = str.replace('$', '');
      str = Number(str).toFixed(2);
      const _num = Number(str);
      _value = isNaN(_num) ? 0 : _num;
    }
    return _value;
  }

  private _currencyFormat(
    currency: number,
    mask: (rawValue: any) => any
  ): string {
    // Rounding issue in mask
    const _currency = isNaN(currency) ? 0 : Math.round(currency * 100) / 100;
    const _strValue = _currency.toFixed(2);
    const _mask = conformToMask(_strValue, mask, {});
    return _mask.conformedValue;
  }

  private _stripFormatting(value: string) {
    return value ? value.replace(/ /g, '') : null;
  }

  private _getSpouse() {
    return {
      spouse: {
        firstName: this.spouse.firstName,
        lastName: this.spouse.lastName,
        phn: this._stripFormatting(this.spouse.phn),
      },
      spouseConsent: this.spouse.consent,
    };
  }

  private _getSpouseIncome() {
    const obj = {
      spouseIncome: {
        income: this._currencyStrToNumber(this.spouse.incomeStr),
      },
    };

    if (this.isLastYearIncome) {
      obj.spouseIncome = Object.assign(obj.spouseIncome, {
        rdspIncome: this._currencyStrToNumber(this.spouse.rdspIncomeStr),
      });
    }
    return obj;
  }
}
