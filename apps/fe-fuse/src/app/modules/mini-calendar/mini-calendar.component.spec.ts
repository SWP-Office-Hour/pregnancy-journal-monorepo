import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCalendarComponent } from './mini-calendar.component';

describe('MiniCalendarComponent', () => {
  let component: MiniCalendarComponent;
  let fixture: ComponentFixture<MiniCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
