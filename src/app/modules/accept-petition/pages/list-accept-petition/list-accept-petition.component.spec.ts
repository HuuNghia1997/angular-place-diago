import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAcceptPetitionComponent } from './list-accept-petition.component';

describe('ListAcceptPetitionComponent', () => {
  let component: ListAcceptPetitionComponent;
  let fixture: ComponentFixture<ListAcceptPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAcceptPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAcceptPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
