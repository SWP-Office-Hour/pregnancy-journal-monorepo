import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekPregnancySliderComponent } from './week-pregnancy-slider.component';

describe('WeekPregnancySliderComponent', () => {
  let component: WeekPregnancySliderComponent;
  let fixture: ComponentFixture<WeekPregnancySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekPregnancySliderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekPregnancySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
