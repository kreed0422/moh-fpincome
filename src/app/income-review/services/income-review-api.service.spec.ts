import { TestBed } from '@angular/core/testing';

import { IncomeReviewApiService } from './income-review-api.service';

describe('IncomeReviewApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncomeReviewApiService = TestBed.get(IncomeReviewApiService);
    expect(service).toBeTruthy();
  });
});
