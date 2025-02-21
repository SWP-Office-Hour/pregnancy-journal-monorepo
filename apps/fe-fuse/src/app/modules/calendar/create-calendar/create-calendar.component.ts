import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReminderCreateRequest, ReminderResponse } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
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
      title: ['', Validators.required],
      content: ['', Validators.required],
      remind_date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reminderForm.invalid) {
      this.reminderForm.markAllAsTouched();
      return;
    }
    const reminderData: ReminderCreateRequest = {
      title: this.reminderForm.get('title')?.value,
      content: this.reminderForm.get('content')?.value,
      remind_date: (this.reminderForm.get('remind_date')?.value as DateTime).toISODate()!,
    };
    console.log(reminderData);
    this._calendarService.createReminder(reminderData).subscribe((res: ReminderResponse) => {
      console.log(res);
      this.matDialogRef.close();
    });
  }
}
