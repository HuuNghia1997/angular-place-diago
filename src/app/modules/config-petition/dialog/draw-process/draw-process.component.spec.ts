import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawProcessComponent } from './draw-process.component';

describe('DrawProcessComponent', () => {
  let component: DrawProcessComponent;
  let fixture: ComponentFixture<DrawProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
