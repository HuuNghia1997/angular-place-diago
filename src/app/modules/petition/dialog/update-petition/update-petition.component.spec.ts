import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePetitionComponent } from './update-petition.component';

describe('UpdatePetitionComponent', () => {
  let component: UpdatePetitionComponent;
  let fixture: ComponentFixture<UpdatePetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
