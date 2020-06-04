import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ReviewObject } from '../component/review-container/review-container.component';
import { ServerPayload } from '../models/review-income-api';
import { formatISO } from 'date-fns';
import { Person, Address, CommonImage } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES } from '../income-review.constants';
import { conformToMask } from 'angular2-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export enum FpcDocumentTypes {
  SupportDocument = 'SUPPORTDOCUMENT',
}

export class Registrant extends Person {
  phn: string;

  // consent declaration
  consent: boolean = false;

  // financial information
  originalIncome: number;
  reducedIncome: number;
  remainderIncome: number;

  get incomeSubTotal() {
    return (
      this._convertNaN(this.originalIncome) +
      this._convertNaN(this.reducedIncome) +
      this._convertNaN(this.remainderIncome)
    );
  }

  clearIncome() {
    this.originalIncome = undefined;
    this.reducedIncome = undefined;
    this.remainderIncome = undefined;
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
  readonly spSectionTitle = `SPOUSE'S ESTIMATED 2020 GROSS INCOME`;
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

  // Support documents
  originalIncomeSupportDocs: CommonImage<FpcDocumentTypes>[] = [];
  reducedIncomeSupportDocs: CommonImage<FpcDocumentTypes>[] = [];
  remainderIncomeSupportDocs: CommonImage<FpcDocumentTypes>[] = [];

  applicationResponse: ServerPayload;

  // Money masks
  moneyMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    integerLimit: 6, // Max numeric value is 999,999.99
  });

  totalMoneyMask = createNumberMask({
    prefix: '',
    allowDecimal: true,
    integerLimit: 7, // Max numeric value is 9,999,999.99
  });

  // Payload for application
  get applicationPayload() {
    const payload = {
      applicationUUID: this.applicationUUID,

      fpcIncomeReviewCovid19: {
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
        grossIncome: {
          applicantIncome: {
            originalIncome: this.applicant.originalIncome,
            reducedIncome: this.applicant.reducedIncome,
            remainderIncome: this.applicant.remainderIncome,
            subtotal: this.applicant.incomeSubTotal,
          },
          totalIncome: this.incomeTotal,
        },
        applicantConsent: this.applicant.consent,
      },
      attachments: this._consolidateDocuments().map((x) => {
        return x.toJSON();
      }),
    };

    if (this.hasSpouse) {
      payload.fpcIncomeReviewCovid19.grossIncome = Object.assign(
        payload.fpcIncomeReviewCovid19.grossIncome,
        this._getSpouseIncome()
      );
      payload.fpcIncomeReviewCovid19 = Object.assign(
        payload.fpcIncomeReviewCovid19,
        this._getSpouse()
      );
    }
    return payload;
  }

  get incomeTotal() {
    return this.applicant.incomeSubTotal + this.spouse.incomeSubTotal;
  }

  get uploadedDocCount() {
    const cnt =
      this.originalIncomeSupportDocs.length +
      this.reducedIncomeSupportDocs.length +
      this.remainderIncomeSupportDocs.length;
    return Number(cnt).toString();
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
              value: this._currencyFormat(
                this.applicant.originalIncome,
                this.moneyMask
              ),
              extraInfo: '1',
            },
            {
              label: this.reducedIncomeLabel,
              value: this._currencyFormat(
                this.applicant.reducedIncome,
                this.moneyMask
              ),
              extraInfo: '2',
            },
            {
              label: this.remainderIncomeLabel,
              value: this._currencyFormat(
                this.applicant.remainderIncome,
                this.moneyMask
              ),
              extraInfo: '3',
            },
            {
              label: this.hasSpouse
                ? this.subtotalLabelLine1to3
                : this.totalLabelLine1to3,
              value: this._currencyFormat(
                this.applicant.incomeSubTotal,
                this.totalMoneyMask
              ),
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
            value: this._currencyFormat(
              this.spouse.originalIncome,
              this.moneyMask
            ),
            extraInfo: '5',
          },
          {
            label: this.reducedIncomeLabel,
            value: this._currencyFormat(
              this.spouse.reducedIncome,
              this.moneyMask
            ),
            extraInfo: '6',
          },
          {
            label: this.remainderIncomeLabel,
            value: this._currencyFormat(
              this.spouse.remainderIncome,
              this.moneyMask
            ),
            extraInfo: '7',
          },
          {
            label: this.subtotalLabelLine5to7,
            value: this._currencyFormat(
              this.spouse.incomeSubTotal,
              this.totalMoneyMask
            ),
            extraInfo: '8',
          },
        ],
      };
      const totalSection = {
        subHeading: null,
        sectionItems: [
          {
            label: this.totalLabelLine4and8,
            value: this._currencyFormat(this.incomeTotal, this.totalMoneyMask),
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
          sectionItems: [
            { label: 'Documents uploaded', value: this.uploadedDocCount },
          ],
        },
      ],
    };
  }

  currencyStrToNumber(strValue: string): number {
    if (strValue) {
      let value = strValue.replace(/,/g, '');
      value = value.replace('$', '');
      return Number(value);
    }
    return 0;
  }

  private _currencyFormat(currency: number, moneyMask: string): string {
    const _currency = isNaN(currency) ? 0 : currency;
    const mask = conformToMask(_currency.toFixed(2), moneyMask, {});
    return `$ ${mask.conformedValue}`;
  }

  private _stripFormatting(value: string) {
    return value ? value.replace(/ /g, '') : null;
  }

  private _consolidateDocuments() {
    let consolidatedDocs: CommonImage<FpcDocumentTypes>[] = [
      ...this.originalIncomeSupportDocs,
    ];

    if (this.reducedIncomeSupportDocs.length > 0) {
      consolidatedDocs = consolidatedDocs.concat([
        ...this.reducedIncomeSupportDocs,
      ]);
    }

    if (this.remainderIncomeSupportDocs.length > 0) {
      consolidatedDocs = consolidatedDocs.concat([
        ...this.remainderIncomeSupportDocs,
      ]);
    }

    // update attachment order and document type
    consolidatedDocs.forEach((x, idx) => {
      x.attachmentOrder = idx + 1;
      x.documentType = FpcDocumentTypes.SupportDocument;
    });
    return consolidatedDocs;
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
    return {
      spouseIncome: {
        originalIncome: this.spouse.originalIncome,
        reducedIncome: this.spouse.reducedIncome,
        remainderIncome: this.spouse.remainderIncome,
        subtotal: this.spouse.incomeSubTotal,
      },
    };
  }
}
