import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PregnancyRecordSelectComponent } from './pregnancy-record-select.component';

describe('PregnancyRecordSelectComponent', () => {
  let component: PregnancyRecordSelectComponent;
  let fixture: ComponentFixture<PregnancyRecordSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PregnancyRecordSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PregnancyRecordSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
