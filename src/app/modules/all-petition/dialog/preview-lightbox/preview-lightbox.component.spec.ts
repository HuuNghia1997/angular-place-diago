import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewLightboxComponent } from './preview-lightbox.component';

describe('PreviewLightboxComponent', () => {
  let component: PreviewLightboxComponent;
  let fixture: ComponentFixture<PreviewLightboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewLightboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
