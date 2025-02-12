import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingSelectComponent } from './tracking-select.component';

describe('PregnancyRecordSelectComponent', () => {
  let component: TrackingSelectComponent;
  let fixture: ComponentFixture<TrackingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
