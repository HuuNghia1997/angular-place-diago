import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPetitionComponent } from './comment-petition.component';

describe('CommentPetitionComponent', () => {
  let component: CommentPetitionComponent;
  let fixture: ComponentFixture<CommentPetitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentPetitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentPetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
