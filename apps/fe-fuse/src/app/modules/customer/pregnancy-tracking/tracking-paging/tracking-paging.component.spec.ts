import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackingPagingComponent } from './tracking-paging.component';

describe('PregnancyTrackingPagingComponent', () => {
  let component: TrackingPagingComponent;
  let fixture: ComponentFixture<TrackingPagingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackingPagingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingPagingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
