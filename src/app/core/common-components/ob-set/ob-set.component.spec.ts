import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObSetComponent } from './ob-set.component';

describe('ObSetComponent', () => {
  let component: ObSetComponent;
  let fixture: ComponentFixture<ObSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
