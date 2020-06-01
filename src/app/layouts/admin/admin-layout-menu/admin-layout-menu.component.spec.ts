import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutMenuComponent } from './admin-layout-menu.component';

describe('AdminLayoutMenuComponent', () => {
  let component: AdminLayoutMenuComponent;
  let fixture: ComponentFixture<AdminLayoutMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLayoutMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
