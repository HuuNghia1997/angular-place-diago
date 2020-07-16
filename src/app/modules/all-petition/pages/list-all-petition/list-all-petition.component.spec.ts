import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllPetitionComponent } from './list-all-petition.component';

describe('ListAllPetitionComponent', () => {
  let component: ListAllPetitionComponent;
  let fixture: ComponentFixture<ListAllPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAllPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
