import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedCoreModule,
         BYPASS_GUARDS,
         START_PAGE_URL,
         DefaultPageGuardService,
         AbstractPageGuardService,
         LoadPageGuardService } from 'moh-common-lib';

import { IncomeReviewRoutingModule } from './income-review-routing.module';
import { IncomeReviewComponent } from './income-review.component';
import { HomeComponent } from './pages/home/home.component';
import { ReviewComponent } from './pages/review/review.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { environment } from '../../environments/environment';
import { INCOME_REVIEW_PAGES } from './income-review.constants';


@NgModule({
  declarations: [
    IncomeReviewComponent,
    HomeComponent,
    ReviewComponent,
    ConfirmationComponent
  ],
  imports: [
    CommonModule,
    SharedCoreModule,
    IncomeReviewRoutingModule
  ],
  providers: [
    { provide: BYPASS_GUARDS, useValue: environment.developmentMode.enabled && environment.developmentMode.bypassGuards },
    { provide: START_PAGE_URL, useValue: INCOME_REVIEW_PAGES.HOME.fullpath },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
  ]
})
export class IncomeReviewModule { }
