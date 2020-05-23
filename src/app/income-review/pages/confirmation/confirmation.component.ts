import { Component, OnInit, ViewChild } from '@angular/core';

import { format } from 'date-fns';
import { Base, ApiStatusCodes, PageStateService } from 'moh-common-lib';

import {
  SUCCESSFUL_CONFIRMATION_MSG,
  ERROR_CONFIRMATION_MSG,
} from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { ReviewContainerComponent } from '../../component/review-container/review-container.component';

@Component({
  selector: 'fpir-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent extends Base implements OnInit {
  @ViewChild('personalInfo', { static: true })
  personalInfo: ReviewContainerComponent;
  @ViewChild('grossIncome', { static: true })
  grossIncome: ReviewContainerComponent;
  @ViewChild('supportDocs', { static: true })
  supportDocs: ReviewContainerComponent;

  readonly printView: boolean = true;

  // Default to error state - NOTE: set to ERROR, when start coding logic
  displayIcon: ApiStatusCodes = ApiStatusCodes.SUCCESS;

  pageTitle: string = 'Confirmation Message';

  constructor(
    private pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService
  ) {
    super();
  }

  ngOnInit() {
    this.pageStateService.clearCompletePages();

    this.personalInfo.reviewObject = this.incomeReviewDataService.getPersonalInformationSection(
      this.printView
    );
    this.grossIncome.reviewObject = this.incomeReviewDataService.getGrossIncomeSection(
      this.printView
    );
    this.supportDocs.reviewObject = this.incomeReviewDataService.getSupportDocsSection(
      this.printView
    );
  }

  get isError() {
    return this.displayIcon === ApiStatusCodes.ERROR;
  }

  get confirmationMessage() {
    return this.displayIcon === ApiStatusCodes.SUCCESS
      ? SUCCESSFUL_CONFIRMATION_MSG
      : ERROR_CONFIRMATION_MSG;
  }

  get referenceNumber() {
    return 'REF#1234';
  }

  get submissionDate() {
    const dt = new Date();
    return format(dt, 'MMMM dd, yyyy');
  }

  print(event: Event) {
    window.print();
    event.stopPropagation();
    return false;
  }
}
