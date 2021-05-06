import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePatientListComponent } from './profile-patient-list.component';

describe('ProfilePatientListComponent', () => {
  let component: ProfilePatientListComponent;
  let fixture: ComponentFixture<ProfilePatientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePatientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
