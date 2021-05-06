import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComposeComponent } from './order-compose.component';

describe('OrderComposeComponent', () => {
  let component: OrderComposeComponent;
  let fixture: ComponentFixture<OrderComposeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderComposeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComposeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
