import { Component, ViewChild, Input } from '@angular/core';
import { Base } from 'moh-common-lib';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'fpir-collection-notice',
  templateUrl: './collection-notice.component.html',
})
export class CollectionNoticeComponent extends Base {
  @Input() isDisabled: boolean = false;
  @Input() buttonLabel: string = 'Continue';

  @ViewChild('collectionNoticeModal', { static: true })
  public collectionNoticeModal: ModalDirective;

  constructor() {
    super();
  }

  public openModal(): void {
    this.collectionNoticeModal.config.keyboard = false;
    this.collectionNoticeModal.show();
  }

  public closeModal($event): boolean {
    this.collectionNoticeModal.hide();
    $event.stopPropagation();
    return false;
  }
}
