import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsufficientPermissionComponent } from './insufficient-permission.component';

describe('InsufficientPermissionComponent', () => {
  let component: InsufficientPermissionComponent;
  let fixture: ComponentFixture<InsufficientPermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsufficientPermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
