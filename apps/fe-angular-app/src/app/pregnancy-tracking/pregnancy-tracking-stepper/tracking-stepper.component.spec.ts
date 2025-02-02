import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingStepperComponent } from './tracking-stepper.component';

describe('TrackingStepperComponent', () => {
  let component: TrackingStepperComponent;
  let fixture: ComponentFixture<TrackingStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingStepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
