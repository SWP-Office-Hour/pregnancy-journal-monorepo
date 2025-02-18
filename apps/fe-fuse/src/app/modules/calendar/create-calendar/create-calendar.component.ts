import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-create-calendar',
  imports: [
    CdkTextareaAutosize,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './create-calendar.component.html',
  styleUrl: './create-calendar.component.css',
})
export class CreateCalendarComponent {
  protected reminderForm: FormGroup;
  protected activeDay = this._calendarService.activeDay;

  constructor(
    public matDialogRef: MatDialogRef<CreateCalendarComponent>,
    private _formBuilder: FormBuilder,
    private _calendarService: CalendarService,
  ) {
    this.reminderForm = this._formBuilder.group({
      title: [''],
      content: [''],
      remind_date: [''],
    });
  }

  onSubmit(): void {
    this._calendarService.createReminder(this.reminderForm.value);
    this.matDialogRef.close();
  }
}
