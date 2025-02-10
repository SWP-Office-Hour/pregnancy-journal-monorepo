import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PregnancyTrackingSelectComponent } from './pregnancy-tracking-select.component';

describe('PregnancyRecordSelectComponent', () => {
  let component: PregnancyTrackingSelectComponent;
  let fixture: ComponentFixture<PregnancyTrackingSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyTrackingSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyTrackingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
