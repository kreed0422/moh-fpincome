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
import { SplunkLoggingService } from '../../../services/splunk-logging.service';

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
  readonly supportDocumentExampleTilte =
    '<strong>Examples of supporting documents</strong>';
  readonly exampleSupportDocs2 =
    '<p>Upload each document once only.</p><ul><li>' +
    '<strong>Canada Emergency Response Benefit (CERB) and the BC Emergency Benefit for Workers:</strong> ' +
    'Statement from the CERB and/or the BC Emergency Benefit for Workers confirming payment of the benefit.' +
    '</li><li><strong>Other income:</strong> See above for supporting documents.</li></ul>';

  // Store document errors
  originalIncomeUploadDocError: CommonImage = null;
  reducedIncomeUploadDocError: CommonImage = null;
  remainderIncomeUploadDocError: CommonImage = null;
  originalIncomeUploadDocErrorMsg: string = null;
  reducedIncomeUploadDocErrorMsg: string = null;
  remainderIncomeUploadDocErrorMsg: string = null;

  constructor(
    protected router: Router,
    protected containerService: ContainerService,
    protected pageStateService: PageStateService,
    private incomeReviewDataService: IncomeReviewDataService,
    private splunkLoggingService: SplunkLoggingService
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
    // Set file error to null - hide error container
    this.originalIncomeUploadDocError = null;
    // Save updated document array
    this.incomeReviewDataService.originalIncomeSupportDocs = images
      ? images
      : [];
  }

  get reducedIncomeSupportDocs() {
    return this.incomeReviewDataService.reducedIncomeSupportDocs;
  }
  set reducedIncomeSupportDocs(images: CommonImage<FpcDocumentTypes>[]) {
    // Set file error to null - hide error container
    this.reducedIncomeUploadDocError = null;
    // Save updated document array
    this.incomeReviewDataService.reducedIncomeSupportDocs = images
      ? images
      : [];
  }

  get remainderIncomeSupportDocs() {
    return this.incomeReviewDataService.remainderIncomeSupportDocs;
  }
  set remainderIncomeSupportDocs(images: CommonImage<FpcDocumentTypes>[]) {
    // Set file error to null - hide error container
    this.remainderIncomeUploadDocError = null;
    // Save updated document array
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
    return (
      this.form.valid &&
      !this.originalIncomeUploadDocError &&
      !this.reducedIncomeUploadDocError &&
      !this.remainderIncomeUploadDocError
    );
  }

  continue() {
    if (this.canContinue()) {
      this.navigate(INCOME_REVIEW_PAGES.REVIEW.fullpath);
    }
  }

  // Error handling for file uploads
  originalIncomeSupportDocError(error: CommonImage) {
    this.originalIncomeUploadDocErrorMsg = this._uploadErrors(error);
    this.originalIncomeUploadDocError = error;

    // Log upload document errors
    this.splunkLoggingService.logError({
      event: 'Document Upload - Original Income',
      errorCode: error.error,
    });
  }
  reducedIncomeSupportDocError(error: CommonImage) {
    this.reducedIncomeUploadDocErrorMsg = this._uploadErrors(error);
    this.reducedIncomeUploadDocError = error;

    // Log upload document errors
    this.splunkLoggingService.logError({
      event: 'Document Upload - Reduced Income',
      errorCode: error.error,
    });
  }
  remainderIncomeSupportDocError(error: CommonImage) {
    this.remainderIncomeUploadDocErrorMsg = this._uploadErrors(error);
    this.remainderIncomeUploadDocError = error;

    // Log upload document errors
    this.splunkLoggingService.logError({
      event: 'Document Upload - Remainder Income',
      errorCode: error.error,
    });
  }

  private _uploadErrors(error: CommonImage) {
    if (!error.error) {
      return null;
    }
    return (
      'We ran into a problem uploading your document. ' +
      'Make sure your file is PG, PNG, GIF, BMP or PDF. ' +
      'Go to previous page, return to this page, and try again.'
    );
  }
}
