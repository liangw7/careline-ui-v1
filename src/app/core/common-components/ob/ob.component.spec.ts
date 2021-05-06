import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObComponent } from './ob.component';

describe('ObComponent', () => {
  let component: ObComponent;
  let fixture: ComponentFixture<ObComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
