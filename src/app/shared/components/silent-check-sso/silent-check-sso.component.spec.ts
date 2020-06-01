import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SilentCheckSsoComponent } from './silent-check-sso.component';

describe('SilentCheckSsoComponent', () => {
  let component: SilentCheckSsoComponent;
  let fixture: ComponentFixture<SilentCheckSsoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SilentCheckSsoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SilentCheckSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
