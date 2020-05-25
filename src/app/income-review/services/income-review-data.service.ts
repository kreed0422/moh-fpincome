import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ReviewObject } from '../component/review-container/review-container.component';
import { ServerPayload } from '../models/review-income-api';
import { formatISO } from 'date-fns';

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

  // Consent (checkboxes)
  registrantConsent: boolean = false;
  spouseConsent: boolean = false;

  hasSpouse: boolean;

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
    return {
      heading: 'Personal Information',
      sectionItems: [
        { label: 'First name:', value: 'John' },
        { label: 'Last name:', value: 'Sivertime' },
        { label: 'Address:', value: '876 Tree Street' },
        { label: 'City:', value: 'Cortney' },
        { label: 'Postal code:', value: 'V8J 8J8' },
        { label: 'PHN:', value: '2468024680' },
      ],
      isPrintView: printView,
    };
  }

  getGrossIncomeSection(printView: boolean = false): ReviewObject {
    return {
      heading: 'Gross Income',
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
      sectionItems: [{ label: 'Documents uploaded', value: '3' }],
      isPrintView: printView,
    };
  }
}
