import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCareComponent } from './patient-care.component';

describe('PatientCareComponent', () => {
  let component: PatientCareComponent;
  let fixture: ComponentFixture<PatientCareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
