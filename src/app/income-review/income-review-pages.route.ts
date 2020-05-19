import { INCOME_REVIEW_PAGES } from './income-review.constants';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReviewComponent } from './pages/review/review.component';
import { ConsentComponent } from './pages/consent/consent.component';

/** The individual page routes only, does not include container */
export const incomeReviewPageRoutes: Routes = [
  {
    path: '',
    redirectTo: INCOME_REVIEW_PAGES.HOME.path,
    pathMatch: 'full',
  },
  {
    path: INCOME_REVIEW_PAGES.HOME.path,
    component: HomeComponent,
    data: { title: INCOME_REVIEW_PAGES.HOME.title },
  },
  {
    path: INCOME_REVIEW_PAGES.REVIEW.path,
    component: ReviewComponent,
    data: { title: INCOME_REVIEW_PAGES.REVIEW.title },
  },
  {
    path: INCOME_REVIEW_PAGES.CONSENT.path,
    component: ConsentComponent,
    data: { title: INCOME_REVIEW_PAGES.CONSENT.title },
  },
];
