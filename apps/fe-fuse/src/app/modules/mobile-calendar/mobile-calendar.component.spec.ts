import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCalendarComponent } from './mobile-calendar.component';

describe('MobileCalendarComponent', () => {
  let component: MobileCalendarComponent;
  let fixture: ComponentFixture<MobileCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
