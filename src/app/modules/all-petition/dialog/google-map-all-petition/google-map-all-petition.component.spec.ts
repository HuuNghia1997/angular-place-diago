import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapAllPetitionComponent } from './google-map-all-petition.component';

describe('GoogleMapAllPetitionComponent', () => {
  let component: GoogleMapAllPetitionComponent;
  let fixture: ComponentFixture<GoogleMapAllPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapAllPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapAllPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
