import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyWeekInfoComponent } from './pregnancy-week-info.component';

describe('PregnancyWeekInfoComponent', () => {
  let component: PregnancyWeekInfoComponent;
  let fixture: ComponentFixture<PregnancyWeekInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyWeekInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyWeekInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
