import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationCompletedComponent } from './confirmation-completed.component';

describe('ConfirmationCompletedComponent', () => {
  let component: ConfirmationCompletedComponent;
  let fixture: ComponentFixture<ConfirmationCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
