import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProcessComponent } from './update-process.component';

describe('UpdateProcessComponent', () => {
  let component: UpdateProcessComponent;
  let fixture: ComponentFixture<UpdateProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
