import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoteResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../../environments/environment';

export interface NoteDetailDialogData {
  note: NoteResponse;
  isNew?: boolean;
}

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TextFieldModule,
    MatCheckboxModule,
    ToastModule,
    ConfirmPopupModule,
    DatePipe,
    MatDatepickerModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class NoteDetailComponent implements OnInit {
  noteForm!: FormGroup;
  isEditMode: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<NoteDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDetailDialogData,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      title: [this.data?.note?.title || '', Validators.required],
      content: [this.data?.note?.content || '', Validators.required],
      date: [DateTime.fromJSDate(new Date(this.data?.note?.date || Date.now())), Validators.required],
      isImportant: [this.data?.note?.status === Status.ACTIVE || false],
    });

    // If viewing only (not editing), disable form
    if (this.data?.note.status == Status.ACTIVE) {
      this.noteForm.disable();
    }
  }

  saveNote(): void {
    if (this.noteForm.invalid) return;

    const noteData = {
      note_id: this.data?.note?.note_id,
      title: this.noteForm.value.title,
      content: this.noteForm.value.content,
      date: (this.noteForm.value.date as DateTime).plus({ hours: 7 }).toJSDate(),
      status: this.noteForm.value.isImportant ? Status.ACTIVE : Status.INACTIVE,
    };

    if (this.data?.note?.note_id) {
      // Update existing note
      this.http.patch(`${environment.apiUrl}note`, noteData).subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã cập nhật ghi chú',
            life: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating note:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật ghi chú. Vui lòng thử lại sau.',
            life: 3000,
          });
        },
      });
    } else {
      // Create new note
      console.log('Creating new note:', noteData);
      this.http.post(`${environment.apiUrl}note`, noteData).subscribe({
        next: (result) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đã tạo ghi chú mới',
            life: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating note:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể tạo ghi chú. Vui lòng thử lại sau.',
            life: 3000,
          });
        },
      });
    }
  }

  deleteNote(): void {
    if (!this.data?.note?.note_id) return;

    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa ghi chú này?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.http.delete(`${environment.apiUrl}note/${this.data.note.note_id}`).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Đã xóa ghi chú',
              life: 3000,
            });
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Error deleting note:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa ghi chú. Vui lòng thử lại sau.',
              life: 3000,
            });
          },
        });
      },
    });
  }

  protected readonly Status = Status;
}
