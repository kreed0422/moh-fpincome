import { Injectable } from '@angular/core';
import { AbstractHttpService } from 'moh-common-lib';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { SplunkLoggingService } from '../../services/splunk-logging.service';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncomeReviewApiService extends AbstractHttpService {
  protected _headers: HttpHeaders;

  private _token;

  constructor(
    protected http: HttpClient,
    private splunkLoggingServicece: SplunkLoggingService
  ) {
    super(http);
    this.logHTTPRequestsToConsole =
      environment.developmentMode.logHTTPRequestsToConsole;
  }

  public setCaptchaToken(token: string) {
    this._token = token;
    this._headers = this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': `Bearer ${this._token}`,
    });
  }

  /**
   *
   * @param jsonPayLoad Information for income review application
   */
  public submitApplication(jsonPayLoad: any) {
    const url = `${environment.api.baseAPIUrl}/${environment.api.application}`;

    // Add requestUUID to json payload object
    const payload = Object.assign(jsonPayLoad, {
      requestUUID: this.generateUUID(),
    });

    return this.post(url, payload);
  }

  /*
  public uploadDocuments(attachment: CommonImage, applicationUUID) {
    let url = `${environment.api.attachments}/${applicationUUID}/attachments/${attachment.uuid}`;

    url += `?attachmentdocumenttype=${FpcDocumentTypes.SupportDocument}&programArea=PHARMANET&contentType=1`;

    return this.uploadAttachment(url, attachment);
  }

    submitForm(jsonPayLoad, supportDocuments: CommonImage<FpcDocumentTypes>[], applicationUUID) {
      TODO: update to handle an array of documents
    return this.uploadSignature(signature, applicationUUID)
      .pipe(
        flatMap(attachRes => this.submitJson(jsonPayLoad, applicationUUID, signature)),
        catchError(this.handleError.bind(this))
      );
  }


  */

  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side / network error occured
      console.error('An error occured: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned error code: ${error.status}.  Error body: ${error.error}`
      );
    }

    this.splunkLoggingServicece.logHttpError(error);

    // A user facing error message /could/ go here; we shouldn't log dev info through the throwError observable
    return throwError('Something went wrong with the network request.');
  }
}
