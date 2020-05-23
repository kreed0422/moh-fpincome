import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewContainerComponent } from './review-container.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReviewContainerComponent', () => {
  let component: ReviewContainerComponent;
  let fixture: ComponentFixture<ReviewContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewContainerComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
