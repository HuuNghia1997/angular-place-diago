import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProcessComponent } from './show-process.component';

describe('ShowProcessComponent', () => {
  let component: ShowProcessComponent;
  let fixture: ComponentFixture<ShowProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
