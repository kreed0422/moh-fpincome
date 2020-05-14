import { Component, OnInit } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import { Router } from '@angular/router';
import { ContainerService, PageStateService } from 'moh-common-lib';
import { INCOME_REVIEW_PAGES, FORM_SUBMIT_LABEL } from '../../income-review.constants';
import { IncomeReviewDataService } from '../../services/income-review-data.service';

@Component({
  selector: 'fpir-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent extends BaseForm implements OnInit {

  constructor( protected router: Router,
               protected containerService: ContainerService,
               protected pageStateService: PageStateService,
               private incomeReviewDataService: IncomeReviewDataService ) {
    super( router, containerService, pageStateService );
   }

   ngOnInit() {
    // Override BaseForm init method
    this.containerService.setSubmitLabel( FORM_SUBMIT_LABEL );
    this.containerService.setUseDefaultColor( false );
   }

   continue() {
    this.navigate( INCOME_REVIEW_PAGES.CONFIRMATION.fullpath );
  }

}
