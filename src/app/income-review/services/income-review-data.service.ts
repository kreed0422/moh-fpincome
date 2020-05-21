import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

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

  /**
   * Used to switch review contents to a view to be printed (i.e. no edit icons, or grey background)
   */
  isPrintView: boolean = false;

  // Infomation for income review process
  isRegistered: boolean;
  isIncomeLess: boolean;

  constructor() {}
}
