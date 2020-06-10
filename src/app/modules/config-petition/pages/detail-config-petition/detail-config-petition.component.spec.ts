import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailConfigPetitionComponent } from './detail-config-petition.component';

describe('DetailConfigPetitionComponent', () => {
  let component: DetailConfigPetitionComponent;
  let fixture: ComponentFixture<DetailConfigPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailConfigPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailConfigPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
