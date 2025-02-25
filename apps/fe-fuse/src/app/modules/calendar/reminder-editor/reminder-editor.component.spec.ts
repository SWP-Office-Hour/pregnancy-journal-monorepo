import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderEditorComponent } from './reminder-editor.component';

describe('CreateCalendarComponent', () => {
  let component: ReminderEditorComponent;
  let fixture: ComponentFixture<ReminderEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReminderEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReminderEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
