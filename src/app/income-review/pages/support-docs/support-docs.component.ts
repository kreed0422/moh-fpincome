import { Component, Input } from '@angular/core';
import { CommonImage, CommonImageError } from 'moh-common-lib';
import { IncomeReviewDataService } from '../../services/income-review-data.service';
import { SplunkLoggingService } from '../../../services/splunk-logging.service';
import { SupportDocType } from './support-doc-type.enum';

@Component({
  selector: 'fpir-support-docs',
  templateUrl: './support-docs.component.html',
  styleUrls: ['./support-docs.component.scss'],
})
export class SupportDocsComponent {
  @Input() case: SupportDocType = SupportDocType.NoSpouseLastYear;
  @Input() RDSP: boolean = false;

  types = SupportDocType;
  fileError: string = '';

  get files() {
    return this.incomeReviewDataService.incomeSupportDocs;
  }

  set files(docs: CommonImage[]) {
    this.incomeReviewDataService.incomeSupportDocs = docs;
  }

  constructor(
    private incomeReviewDataService: IncomeReviewDataService,
    private splunkLoggingService: SplunkLoggingService
  ) {}

  // Check the collective size, triggered whenever an image is added or removed
  handleImagesChange(imgs: Array<CommonImage>) {
    // Set newly uploaded files
    this.files = imgs;
    let sum = 0;
    let tooSmall = false;

    imgs.forEach((img) => {
      if (typeof img.size === 'number') {
        sum += img.size;
      }

      if (img.size < 20000) {
        this.files.pop();
        tooSmall = true;
      }
    });

    // Same limit as moh-common-lib
    if (sum > 1048576) {
      // Reset the attachments for this upload
      this.files = [];
      this.fileError =
        'The addition of the previous document exceeded the maximum upload size of this supporting document section.';
      this.splunkLoggingService.logError({
        event: `Document Upload - ${this.case}`,
        errorCode: this.fileError,
      });
    } else if (tooSmall) {
      this.fileError =
        'The document you attempted to upload is too small. Please try again with a larger, higher quality file.';
      this.splunkLoggingService.logError({
        event: `Document Upload - ${this.case}`,
        errorCode: this.fileError,
      });
    } else {
      this.fileError = '';
    }
  }

  // Set the error obj and appropriate msg, triggered when component has an error
  handleSupportDocError(error: CommonImage) {
    if (error) {
      switch (error.error) {
        case CommonImageError.WrongType:
          this.fileError = 'That is the wrong type of attachment to submit.';
        case CommonImageError.TooSmall:
          this.fileError =
            'That attachment is too small, please upload a larger attachment.';
        case CommonImageError.TooBig:
          this.fileError =
            'That attachment is too big, please upload a smaller attachment.';
        case CommonImageError.AlreadyExists:
          this.fileError = 'That attachment has already been uploaded.';
        case CommonImageError.Unknown:
          this.fileError =
            'The upload failed, please try again. If the issue persists, please upload a different attachment.';
        case CommonImageError.CannotOpen:
          this.fileError =
            'That attachment cannot be opened, please upload a different attachment.';
        case CommonImageError.PDFnotSupported:
          this.fileError =
            'That PDF type is not supported, please upload a different attachment.';
        case CommonImageError.CannotOpenPDF:
          this.fileError =
            'That PDF cannot be opened, please upload a different attachment.';
        default:
          if (this.fileError) {
            this.splunkLoggingService.logError({
              event: `Document Upload - ${this.case}`,
              errorCode: this.fileError,
            });
          }
      }
    }
  }
}
