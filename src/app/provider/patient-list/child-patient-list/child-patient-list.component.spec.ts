import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildPatientListComponent } from './child-patient-list.component';

describe('ChildPatientListComponent', () => {
  let component: ChildPatientListComponent;
  let fixture: ComponentFixture<ChildPatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildPatientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
