import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFolderComponent } from './provider-folder.component';

describe('ProviderFolderComponent', () => {
  let component: ProviderFolderComponent;
  let fixture: ComponentFixture<ProviderFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderFolderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
