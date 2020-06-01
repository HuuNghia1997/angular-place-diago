import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPetitionComponent } from './detail-petition.component';

describe('DetailPetitionComponent', () => {
  let component: DetailPetitionComponent;
  let fixture: ComponentFixture<DetailPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
