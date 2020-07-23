import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyProcessComponent } from './apply-process.component';

describe('ApplyProcessComponent', () => {
  let component: ApplyProcessComponent;
  let fixture: ComponentFixture<ApplyProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
