import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPetitionComponent } from './list-petition.component';

describe('ListPetitionComponent', () => {
  let component: ListPetitionComponent;
  let fixture: ComponentFixture<ListPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
