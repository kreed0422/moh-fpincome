import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BaseForm } from '../../models/base-form';
import {
  ContainerService,
  PageStateService,
  CommonImage,
} from 'moh-common-lib';
import { Router } from '@angular/router';
import {
  IncomeReviewDataService,
  FpcDocumentTypes,
} from '../../services/income-review-data.service';
import { NgForm } from '@angular/forms';
import { INCOME_REVIEW_PAGES } from '../../income-review.constants';
import { UUID } from 'angular2-uuid';

/**
 * NOTE:  Common File Uploader is not reactive form compatiable
 *        Component in common library will need to be modified to
 *        support both template and reactive forms
 *
 *        THIS PAGE IS A TEMPLATE FORM - WILL NEED TO BE REFACTORED
 *        ONCE COMMON FILE UPLOADER COMPATIBLE WITH REACTIVE FORMS
 */
@Component({
  selector: 'fpir-support-docs',
  templateUrl: './support-docs.component.html',
  styleUrls: ['./support-docs.component.scss'],
})
export class SupportDocsComponent extends BaseForm
  implements OnInit, AfterViewInit {
  @ViewChild('formRef', { static: true }) form: NgForm;

  readonly uploadInstructions =
    'Click add, or drag and drop file into this box';
  readonly originalIncomeSupDocId = 'docUploader_' + UUID.UUID();
  readonly reducedIncomeSupDocId = 'docUploader_' + UUID.UUID();
  readonly remainderIncomeSupDocId = 'docUploader_' + UUID.UUID();

  readonly supportDocumentLabel = 'Supporting document(s)';
  readonly exampleSupportDocs2 =
    '<p><strong>Examples of supporting documents</strong></p>' +
    '<p>Upload each document once only.</p><ul><li>' +
    '<strong>Canada Emergency Response Benefit (CERB) and the BC Emergency Benefit for Workers:</strong> ' +
    'Statement from the CERB and/or the BC Emergency Benefit for Workers confirming payment of the benefit.' +
    '</li><li><strong>Other income:</strong> See above for supporting documents.</li></ul>';

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService
  ) {
    super(router, containerService, pageStateService);
  }

  get exampleSupportDocs() {
    return this.incomeReviewDataService.exampleSupportDocs;
  }

  get originalIncomeSupportDocs() {
    return this.incomeReviewDataService.originalIncomeSupportDocs;
  }
  set originalIncomeSupportDocs(images: CommonImage<FpcDocumentTypes>[]) {
    this.incomeReviewDataService.originalIncomeSupportDocs = images
      ? images
      : [];
  }

  get reducedIncomeSupportDocs() {
    return this.incomeReviewDataService.reducedIncomeSupportDocs;
  }
  set reducedIncomeSupportDocs(images: CommonImage<FpcDocumentTypes>[]) {
    this.incomeReviewDataService.reducedIncomeSupportDocs = images
      ? images
      : [];
  }

  get remainderIncomeSupportDocs() {
    return this.incomeReviewDataService.remainderIncomeSupportDocs;
  }
  set remainderIncomeSupportDocs(images: CommonImage<FpcDocumentTypes>[]) {
    this.incomeReviewDataService.remainderIncomeSupportDocs = images
      ? images
      : [];
  }

  ngOnInit() {
    super.ngOnInit();
  }

  canContinue() {
    Object.keys(this.form.form.controls).forEach((x) => {
      this.form.form.get(x).markAsTouched();
    });
    return this.form.valid;
  }

  continue() {
    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }
}
