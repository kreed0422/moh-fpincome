import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ReviewObject } from '../component/review-container/review-container.component';
import { ServerPayload } from '../models/review-income-api';
import { formatISO } from 'date-fns';
import { Person, Address } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../income-review.constants';

export class Registrant extends Person {
  phn: string;

  // consent declaration
  consent: boolean = false;

  // financial information
  private _originalIncome: number;
  private _reducedIncome: number;
  private _remainderIncome: number;

  get originalIncome() {
    return isNaN(this._originalIncome) ? null : this._originalIncome.toFixed(2);
  }
  set originalIncome(value: string) {
    if (value) {
      this._originalIncome = Number(value);
    }
  }

  get reducedIncome() {
    return isNaN(this._reducedIncome) ? null : this._reducedIncome.toFixed(2);
  }
  set reducedIncome(value: string) {
    if (value) {
      this._reducedIncome = Number(value);
    }
  }

  get remainderIncome() {
    return isNaN(this._remainderIncome)
      ? null
      : this._remainderIncome.toFixed(2);
  }
  set remainderIncome(value: string) {
    if (value) {
      this._remainderIncome = Number(value);
    }
  }

  get incomeSubTotal() {
    const total =
      this._convertNaN(this._originalIncome) +
      this._convertNaN(this._reducedIncome) +
      this._convertNaN(this._remainderIncome);
    return total.toFixed(2);
  }

  private _convertNaN(value: number) {
    return isNaN(value) ? 0 : value;
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

  readonly applSectionTitle = 'YOUR ESTIMATED 2020 GROSS INCOME';
  readonly spSectionTitle = "SPOUSE'S ESTIMATED 2020 GROSS INCOME";
  readonly originalIncomeLabel =
    'Before reduction of income<br><strong>(e.g. January - March)<strong>';
  readonly reducedIncomeLabel =
    'During reduction of income<br><strong>(e.g. April - June)</strong>';
  readonly remainderIncomeLabel = 'Remainder of 2020 (estimated)';
  readonly subtotalLabelLine1to3 = 'SUBTOTAL (lines 1-3)';
  readonly totalLabelLine1to3 = 'TOTAL (lines 1-3)';
  readonly subtotalLabelLine5to7 = 'SUBTOTAL (lines 5-7)';
  readonly totalLabelLine4and8 = '<strong>TOTAL (line 4 + line 8)<strong>';

  dateOfSubmission: Date;

  informationCollectionNoticeConsent: boolean;

  // Infomation for income review process
  isRegistered: boolean;
  isIncomeLess: boolean;

  hasSpouse: boolean;

  applicant: Registrant = new Registrant();
  spouse: Registrant = new Registrant();
  address: Address = new Address();

  applicationResponse: ServerPayload;

  // Payload for application
  get applicationPayload() {
    // Create date
    this.dateOfSubmission = new Date();
    return {
      applicationUUID: this.applicationUUID,
      submissionDate: formatISO(this.dateOfSubmission, {
        representation: 'date',
      }),
    };
  }

  get incomeTotal() {
    const total =
      Number(this.applicant.incomeSubTotal) +
      Number(this.spouse.incomeSubTotal);
    return total.toFixed(2);
  }

  constructor() {}

  getPersonalInformationSection(printView: boolean = false): ReviewObject {
    const obj = {
      heading: 'Personal Information',
      isPrintView: printView,
      redirectPath: INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath,
      section: [
        {
          sectionItems: [
            { label: 'First name:', value: this.applicant.firstName },
            { label: 'Last name:', value: this.applicant.lastName },
            { label: 'Address:', value: this.address.addressLine1 },
            { label: 'City:', value: this.address.city },
            { label: 'Postal code:', value: this.address.postal },
            { label: 'PHN:', value: this.applicant.phn },
          ],
        },
      ],
    };

    if (this.hasSpouse) {
      const spouseSection = {
        sectionItems: [
          { label: 'Spouse first name:', value: this.spouse.firstName },
          { label: 'Spouse last name:', value: this.spouse.lastName },
          { label: 'Spouse PHN:', value: this.spouse.phn },
        ],
      };

      obj.section.push(spouseSection);
    }

    return obj;
  }

  getGrossIncomeSection(printView: boolean = false): ReviewObject {
    const obj = {
      heading: 'Gross Income',
      isPrintView: printView,
      redirectPath: INCOME_REVIEW_PAGES.INCOME.fullpath,
      section: [
        {
          subHeading: this.applSectionTitle,
          sectionItems: [
            {
              label: this.originalIncomeLabel,
              value: `$ ${this.applicant.originalIncome}`,
              extraInfo: '1',
            },
            {
              label: this.reducedIncomeLabel,
              value: `$ ${this.applicant.reducedIncome}`,
              extraInfo: '2',
            },
            {
              label: this.remainderIncomeLabel,
              value: `$ ${this.applicant.remainderIncome}`,
              extraInfo: '3',
            },
            {
              label: this.hasSpouse
                ? this.subtotalLabelLine1to3
                : this.totalLabelLine1to3,
              value: `$ ${this.applicant.incomeSubTotal}`,
              extraInfo: '4',
            },
          ],
        },
      ],
    };

    if (this.hasSpouse) {
      const spouseSection = {
        subHeading: this.spSectionTitle,
        sectionItems: [
          {
            label: this.originalIncomeLabel,
            value: `$ ${this.spouse.originalIncome}`,
            extraInfo: '5',
          },
          {
            label: this.reducedIncomeLabel,
            value: `$ ${this.spouse.reducedIncome}`,
            extraInfo: '6',
          },
          {
            label: this.remainderIncomeLabel,
            value: `$ ${this.spouse.remainderIncome}`,
            extraInfo: '7',
          },
          {
            label: this.subtotalLabelLine5to7,
            value: `$ ${this.spouse.incomeSubTotal}`,
            extraInfo: '8',
          },
        ],
      };
      const totalSection = {
        subHeading: null,
        sectionItems: [
          {
            label: this.totalLabelLine4and8,
            value: `$ ${this.incomeTotal}`,
            extraInfo: '9',
          },
        ],
      };
      obj.section.push(spouseSection);
      obj.section.push(totalSection);
    }

    return obj;
  }

  getSupportDocsSection(printView: boolean = false): ReviewObject {
    return {
      heading: 'Supporting Documents',
      isPrintView: printView,
      redirectPath: INCOME_REVIEW_PAGES.SUPPORT_DOCS.fullpath,
      section: [
        {
          sectionItems: [{ label: 'Documents uploaded', value: '3' }],
        },
      ],
    };
  }
}
