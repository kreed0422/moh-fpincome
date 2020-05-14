import { Component, OnInit } from '@angular/core';

import { format } from 'date-fns';
import { Base, ApiStatusCodes, PageStateService } from 'moh-common-lib';

import { SUCCESSFUL_CONFIRMATION_MSG, ERROR_CONFIRMATION_MSG, INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';

@Component({
  selector: 'fpir-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent extends Base implements OnInit {

  // Default to error state - NOTE: set to ERROR, when start coding logic
  displayIcon: ApiStatusCodes = ApiStatusCodes.SUCCESS;

  constructor( private pageStateService: PageStateService,
               private incomeReviewDataService: IncomeReviewDataService ) {
    super();
  }

  ngOnInit() {
    this.pageStateService.clearCompletePages();

    // Set isPrintView to true
    this.incomeReviewDataService.isPrintView = true;
  }

  get isError() {
    return this.displayIcon === ApiStatusCodes.ERROR;
  }

  get confirmationMessage() {
    return this.displayIcon === ApiStatusCodes.SUCCESS ? SUCCESSFUL_CONFIRMATION_MSG : ERROR_CONFIRMATION_MSG;
  }

  get referenceNumber() {
    return 'REF#1234';
  }

  get submissionDate() {
    const dt = new Date();
    return format( dt, 'MMMM dd, yyyy' );
  }

  // Title for route
  get pageTitle() {
    return INCOME_REVIEW_PAGES.CONFIRMATION.title;
  }

  print( event: Event ) {
    window.print();
    event.stopPropagation();
    return false;
  }
}
