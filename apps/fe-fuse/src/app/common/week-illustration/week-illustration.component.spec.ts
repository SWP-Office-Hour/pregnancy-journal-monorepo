import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekIllustrationComponent } from './week-illustration.component';

describe('WeekIllustrationComponent', () => {
  let component: WeekIllustrationComponent;
  let fixture: ComponentFixture<WeekIllustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekIllustrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekIllustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
