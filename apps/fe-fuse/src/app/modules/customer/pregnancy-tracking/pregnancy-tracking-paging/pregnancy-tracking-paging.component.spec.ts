import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PregnancyTrackingPagingComponent } from './pregnancy-tracking-paging.component';

describe('PregnancyTrackingPagingComponent', () => {
  let component: PregnancyTrackingPagingComponent;
  let fixture: ComponentFixture<PregnancyTrackingPagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyTrackingPagingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyTrackingPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
