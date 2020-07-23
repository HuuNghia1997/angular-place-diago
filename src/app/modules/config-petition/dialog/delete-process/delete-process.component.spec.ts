import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProcessComponent } from './delete-process.component';

describe('DeleteProcessComponent', () => {
  let component: DeleteProcessComponent;
  let fixture: ComponentFixture<DeleteProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
