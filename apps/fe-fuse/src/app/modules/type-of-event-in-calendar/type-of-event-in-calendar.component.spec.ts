import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfEventInCalendarComponent } from './type-of-event-in-calendar.component';

describe('TypeOfEventInCalendarComponent', () => {
  let component: TypeOfEventInCalendarComponent;
  let fixture: ComponentFixture<TypeOfEventInCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeOfEventInCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TypeOfEventInCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
