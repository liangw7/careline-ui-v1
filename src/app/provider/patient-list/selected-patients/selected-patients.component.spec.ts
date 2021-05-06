import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedPatientsComponent } from './selected-patients.component';

describe('SelectedPatientsComponent', () => {
  let component: SelectedPatientsComponent;
  let fixture: ComponentFixture<SelectedPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedPatientsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
