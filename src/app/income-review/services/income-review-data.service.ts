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
      redirectPath: INCOME_REVIEW_PAGES.PERSONAL_INFO.fullpath,
      sectionItems: [
        { label: 'First name:', value: this.applicant.firstName },
        { label: 'Last name:', value: this.applicant.lastName },
        { label: 'Address:', value: this.address.addressLine1 },
        { label: 'City:', value: this.address.city },
        { label: 'Postal code:', value: this.address.postal },
        { label: 'PHN:', value: this.applicant.phn },
      ],
      isPrintView: printView,
    };

    if (this.hasSpouse) {
      const sectionItemsArray = [
        { label: 'Spouse first name:', value: this.spouse.firstName },
        { label: 'Spouse last name:', value: this.spouse.lastName },
        { label: 'Spouse PHN:', value: this.spouse.phn },
      ];
      obj.sectionItems = obj.sectionItems.concat(sectionItemsArray);
    }

    return obj;
  }

  getGrossIncomeSection(printView: boolean = false): ReviewObject {
    return {
      heading: 'Gross Income',
      redirectPath: INCOME_REVIEW_PAGES.INCOME.fullpath,
      subHeading: 'YOUR ESTIMATED 2020 GROSS INCOME',
      sectionItems: [
        {
          label:
            'Before reduction of income<br><strong>(e.g., Jan - March)<strong>',
          value: '$15,000.00',
          extraInfo: '1',
        },
        {
          label:
            'During reduction of income<br><strong>(e.g., April - June)</strong>',
          value: '$0.00',
          extraInfo: '2',
        },
        {
          label: 'Remainder of 2020 (est.)',
          value: '$25,000.00',
          extraInfo: '3',
        },
        { label: 'Total (lines 1-3)', value: '$40,000.00', extraInfo: '4' },
      ],
      isPrintView: printView,
    };
  }

  getSupportDocsSection(printView: boolean = false): ReviewObject {
    return {
      heading: 'Supporting Documents',
      redirectPath: INCOME_REVIEW_PAGES.SUPPORT_DOCS.fullpath,
      sectionItems: [{ label: 'Documents uploaded', value: '3' }],
      isPrintView: printView,
    };
  }
}
