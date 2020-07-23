import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowProcessAllPetitionComponent } from './show-process-all-petition.component';

describe('ShowProcessAllPetitionComponent', () => {
  let component: ShowProcessAllPetitionComponent;
  let fixture: ComponentFixture<ShowProcessAllPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowProcessAllPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowProcessAllPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
