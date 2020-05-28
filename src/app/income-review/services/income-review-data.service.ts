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
  originalIncome: number = 2500.0;
  reducedIncome: number = 1040.0;
  remainderIncome: number = 0.0;

  get incomeSubTotal() {
    return this.originalIncome + this.reducedIncome + this.remainderIncome;
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

  readonly originalIncomeLabel =
    'Before reduction of income<br><strong>(e.g., January - March)<strong>';
  readonly reducedIncomeLabel =
    'During reduction of income<br><strong>(e.g., April - June)</strong>';
  readonly remainderIncomeLabel = 'Remainder of 2020 (estimated)';

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
          subHeading: 'YOUR ESTIMATED 2020 GROSS INCOME',
          sectionItems: [
            {
              label: this.originalIncomeLabel,
              value: '$' + this.applicant.originalIncome.toFixed(2),
              extraInfo: '1',
            },
            {
              label: this.reducedIncomeLabel,
              value: '$' + this.applicant.reducedIncome.toFixed(2),
              extraInfo: '2',
            },
            {
              label: this.remainderIncomeLabel,
              value: '$' + this.applicant.remainderIncome.toFixed(2),
              extraInfo: '3',
            },
            {
              label: 'Total (lines 1-3)',
              value: '$' + this.applicant.incomeSubTotal.toFixed(2),
              extraInfo: '4',
            },
          ],
        },
      ],
    };

    if (this.hasSpouse) {
      const spouseSection = {
        subHeading: "SPOUSE'S ESTIMATED 2020 GROSS INCOME",
        sectionItems: [
          {
            label: this.originalIncomeLabel,
            value: '$' + this.spouse.originalIncome.toFixed(2),
            extraInfo: '5',
          },
          {
            label: this.reducedIncomeLabel,
            value: '$' + this.spouse.reducedIncome.toFixed(2),
            extraInfo: '6',
          },
          {
            label: this.remainderIncomeLabel,
            value: '$' + this.spouse.remainderIncome.toFixed(2),
            extraInfo: '7',
          },
          {
            label: 'Total (lines 5-7)',
            value: '$' + this.spouse.incomeSubTotal.toFixed(2),
            extraInfo: '8',
          },
        ],
      };
      const totalSection = {
        subHeading: null,
        sectionItems: [
          {
            label: '<strong>TOTAL (line 4 + line 8)<strong>',
            value:
              '$' +
              (
                this.applicant.incomeSubTotal + this.spouse.incomeSubTotal
              ).toFixed(2),
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
