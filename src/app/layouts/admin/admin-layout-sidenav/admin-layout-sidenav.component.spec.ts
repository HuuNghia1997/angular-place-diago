import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutSidenavComponent } from './admin-layout-sidenav.component';

describe('AdminLayoutNavComponent', () => {
  let component: AdminLayoutSidenavComponent;
  let fixture: ComponentFixture<AdminLayoutSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminLayoutSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
