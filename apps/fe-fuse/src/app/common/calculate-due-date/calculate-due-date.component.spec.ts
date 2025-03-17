import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculateDueDateComponent } from './calculate-due-date.component';

describe('CalculateDueDateComponent', () => {
  let component: CalculateDueDateComponent;
  let fixture: ComponentFixture<CalculateDueDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculateDueDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculateDueDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
