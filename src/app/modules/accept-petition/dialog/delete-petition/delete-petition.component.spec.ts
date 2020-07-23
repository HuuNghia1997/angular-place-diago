import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePetitionComponent } from './delete-petition.component';

describe('DeletePetitionComponent', () => {
  let component: DeletePetitionComponent;
  let fixture: ComponentFixture<DeletePetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
