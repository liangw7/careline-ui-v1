import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CareProvidersComponent } from './care-providers.component';

describe('CareProvidersComponent', () => {
  let component: CareProvidersComponent;
  let fixture: ComponentFixture<CareProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CareProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CareProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
