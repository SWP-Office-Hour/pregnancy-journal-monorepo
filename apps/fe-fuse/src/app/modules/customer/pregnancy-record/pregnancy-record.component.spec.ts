import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PregnancyRecordComponent } from './pregnancy-record.component';

describe('PregnancyRecordComponent', () => {
  let component: PregnancyRecordComponent;
  let fixture: ComponentFixture<PregnancyRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyRecordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
