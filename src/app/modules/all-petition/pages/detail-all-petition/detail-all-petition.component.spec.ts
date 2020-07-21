import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAllPetitionComponent } from './detail-all-petition.component';

describe('DetailAllPetitionComponent', () => {
  let component: DetailAllPetitionComponent;
  let fixture: ComponentFixture<DetailAllPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailAllPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAllPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
