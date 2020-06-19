import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPetitionComponent } from './accept-petition.component';

describe('AcceptPetitionComponent', () => {
  let component: AcceptPetitionComponent;
  let fixture: ComponentFixture<AcceptPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
