import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

export interface SectionItemType {
  label: string;
  value: string;
  extraInfo?: string;
}

export interface ReviewObject {
  heading: string;
  subHeading?: string;
  redirectPath?: string;
  sectionItems?: SectionItemType[];
  isPrintView: boolean;
}

@Component({
  selector: 'fpir-review-container',
  templateUrl: './review-container.component.html',
  styleUrls: ['./review-container.component.scss'],
})
export class ReviewContainerComponent {
  @Input() reviewObject: ReviewObject;

  constructor(private router: Router) {}

  redirectURL() {
    // Redirect only if path exists
    if (this.reviewObject.redirectPath) {
      this.router.navigate([this.reviewObject.redirectPath]);
    }
  }
}
