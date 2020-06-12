import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAcceptPetitionComponent } from './detail-accept-petition.component';

describe('DetailAcceptPetitionComponent', () => {
  let component: DetailAcceptPetitionComponent;
  let fixture: ComponentFixture<DetailAcceptPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAcceptPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAcceptPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
