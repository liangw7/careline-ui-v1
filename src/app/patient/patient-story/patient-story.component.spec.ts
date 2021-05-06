import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientStoryComponent } from './patient-story.component';

describe('PatientStoryComponent', () => {
  let component: PatientStoryComponent;
  let fixture: ComponentFixture<PatientStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
