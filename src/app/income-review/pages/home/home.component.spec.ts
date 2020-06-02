import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { HomeComponent } from './home.component';
import { CollectionNoticeComponent } from '../../component/collection-notice/collection-notice.component';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent, CollectionNoticeComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
        HttpClientTestingModule,
        CaptchaModule,
        ModalModule.forRoot(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display collection notice', () => {
    expect(component.infoCollectionModal).toBeTruthy();
  });

  it('should have button on collection notice disabled', () => {
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should have button on collection notice enabled when token is set', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    expect(button.nativeElement.disabled).toBeFalsy();
  });

  it('should close collection notice when button clicked', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    button.nativeElement.click();
    fixture.detectChanges();
    const dialog = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal')
    );
    expect(dialog.nativeElement.visable).toBeFalsy();
  });

  // Logic test for continuing
  it('should display required field errors', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    button.nativeElement.click();
    fixture.detectChanges();
    expect(component.canContinue()).toBeFalsy();
    component.continue();
    fixture.detectChanges();
    const errors = fixture.debugElement.queryAll(
      By.css('common-error-container .error--container')
    );
    expect(errors.length).toBe(2);
    errors.forEach((x) => {
      expect(x.nativeElement.textContent).toContain('required');
    });
  });

  it('should indicate user is not eligible when not registered and income less than 10%', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    button.nativeElement.click();
    component.formGroup.controls.isRegistered.setValue(false);
    component.formGroup.controls.isIncomeLess.setValue(false);
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(
        By.css('common-error-container .error--container')
      );
      expect(errors.length).toBe(1);
      errors.forEach((x) => {
        expect(x.nativeElement.textContent).toContain('not eligible');
      });
    });
  });

  it('should indicate user is not eligible when not income less than 10%, but registered', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    button.nativeElement.click();
    component.formGroup.controls.isRegistered.setValue(true);
    component.formGroup.controls.isIncomeLess.setValue(false);
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeFalsy();
      component.continue();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(
        By.css('common-error-container .error--container')
      );
      expect(errors.length).toBe(1);
      errors.forEach((x) => {
        expect(x.nativeElement.textContent).toContain('not eligible');
      });
    });
  });

  it('should coninue when registered and income is less than 10%', () => {
    component.setToken('12345');
    fixture.detectChanges();
    const button = fixture.debugElement.query(
      By.css('fpir-collection-notice .modal-footer button')
    );
    button.nativeElement.click();
    component.formGroup.controls.isRegistered.setValue(true);
    component.formGroup.controls.isIncomeLess.setValue(true);
    component.formGroup.updateValueAndValidity();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.canContinue()).toBeTruthy();
      component.continue();
      fixture.detectChanges();
      const errors = fixture.debugElement.queryAll(
        By.css('common-error-container .error--container')
      );
      expect(errors.length).toBe(0);
    });
  });
});
