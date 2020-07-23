import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConfigPetitionComponent } from './list-config-petition.component';

describe('ListConfigPetitionComponent', () => {
  let component: ListConfigPetitionComponent;
  let fixture: ComponentFixture<ListConfigPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListConfigPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConfigPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
