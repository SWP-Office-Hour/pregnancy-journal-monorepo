import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReminderCreateRequest, ReminderResponse, ReminderUpdateRequest } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { CalendarService } from '../calendar.service';

@Component({
  selector: 'app-reminder-editor',
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
    ToastModule,
    ConfirmPopupModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './reminder-editor.component.html',
  styleUrl: './reminder-editor.component.css',
})
export class ReminderEditorComponent {
  @Input() title: string;
  protected reminderForm: FormGroup;
  protected reminder: ReminderResponse | null;

  constructor(
    public matDialogRef: MatDialogRef<ReminderEditorComponent>,
    private _formBuilder: FormBuilder,
    private _calendarService: CalendarService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    this.reminderForm = this._formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      content: ['', Validators.required],
      remind_date: ['', Validators.required],
    });
    this.reminder = this._calendarService.reminder;
    if (this.reminder) {
      this.reminderForm.patchValue({
        id: this.reminder.reminder_id,
        title: this.reminder.title,
        content: this.reminder.content,
        remind_date: DateTime.fromISO(new Date(this.reminder.remind_date).toISOString()),
      });
      this.title = 'Edit Reminder';
    }
  }

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.onDelete();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      },
    });
  }

  confirmSubmit(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Save',
      },
      accept: () => {
        this.onSubmit();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      },
    });
  }

  onDelete() {
    this._calendarService.deleteReminder(this.reminderForm.get('id')?.value).subscribe((res: ReminderResponse) => {
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
      this._calendarService.clearReminder();
      this.matDialogRef.close();
    });
  }

  onSubmit(): void {
    if (this.reminderForm.invalid) {
      this.reminderForm.markAllAsTouched();
      return;
    }
    if (this.reminder) {
      const updateData: ReminderUpdateRequest = {
        reminder_id: this.reminderForm.get('id')?.value,
        title: this.reminderForm.get('title')?.value,
        content: this.reminderForm.get('content')?.value,
        remind_date: this.reminderForm.get('remind_date')?.value.toISODate(),
      };
      this._calendarService.updateReminder(updateData).subscribe((res: ReminderResponse) => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this._calendarService.clearReminder();
        this.matDialogRef.close();
      });
    } else {
      console.log('click create reminder');
      const reminderData: ReminderCreateRequest = {
        title: this.reminderForm.get('title')?.value,
        content: this.reminderForm.get('content')?.value,
        remind_date: this.reminderForm.get('remind_date')?.value.toISODate(),
      };

      this._calendarService.createReminder(reminderData).subscribe((res: ReminderResponse) => {
        this._calendarService.clearReminder();
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        this.matDialogRef.close();
      });
    }
  }
}
