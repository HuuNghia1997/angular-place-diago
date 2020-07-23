import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnapplyProcessComponent } from './unapply-process.component';

describe('UnapplyProcessComponent', () => {
  let component: UnapplyProcessComponent;
  let fixture: ComponentFixture<UnapplyProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnapplyProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnapplyProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
