import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPosterComponent } from './login-poster.component';

describe('LoginPosterComponent', () => {
  let component: LoginPosterComponent;
  let fixture: ComponentFixture<LoginPosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
