import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChinaComponent } from './area-china.component';

describe('AreaChinaComponent', () => {
  let component: AreaChinaComponent;
  let fixture: ComponentFixture<AreaChinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaChinaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaChinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
