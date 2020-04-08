import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenAuthComponent } from './token-auth.component';

describe('TokenAuthComponent', () => {
  let component: TokenAuthComponent;
  let fixture: ComponentFixture<TokenAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
