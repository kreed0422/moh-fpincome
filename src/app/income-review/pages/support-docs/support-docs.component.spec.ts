import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportDocsComponent } from './support-docs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { RouterTestingModule } from '@angular/router/testing';

describe('SupportDocsComponent', () => {
  let component: SupportDocsComponent;
  let fixture: ComponentFixture<SupportDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SupportDocsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedCoreModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
