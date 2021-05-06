import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCellComponent } from './patient-cell.component';

describe('PatientCellComponent', () => {
  let component: PatientCellComponent;
  let fixture: ComponentFixture<PatientCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
