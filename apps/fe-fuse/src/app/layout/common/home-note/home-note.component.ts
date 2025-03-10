import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NoteResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-note',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, ToastModule, ConfirmPopupModule, DatePipe],
  providers: [ConfirmationService, MessageService],
  templateUrl: './home-note.component.html',
})
export class HomeNoteComponent implements OnInit {
  isLoading = true;
  isOpen = false;
  hasMoreNotes = false;
  hasImportantNotes = false;
  recentNotes: NoteResponse[] = [];
  olderNotes: NoteResponse[] = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  togglePanel(): void {
    this.isOpen = !this.isOpen;

    // Reload notes when opening the panel
    if (this.isOpen) {
      this.loadNotes();
    }
  }

  loadNotes(): void {
    this.isLoading = true;

    this.http.get<NoteResponse[]>(`${environment.apiUrl}/note`).subscribe({
      next: (notes) => {
        if (notes && notes.length > 0) {
          // Sort notes by date, newest first
          const sortedNotes = notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          // Split into recent (last 7 days) and older notes
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          this.recentNotes = sortedNotes.filter((note) => new Date(note.date) >= oneWeekAgo).slice(0, 3); // Limit to 3 recent notes

          this.olderNotes = sortedNotes.filter((note) => new Date(note.date) < oneWeekAgo).slice(0, 2); // Limit to 2 older notes

          // Check if we have more notes than we're showing
          this.hasMoreNotes = notes.length > this.recentNotes.length + this.olderNotes.length;

          // Check for important notes for badge display
          this.hasImportantNotes = notes.some((note) => note.status == Status.ACTIVE);
        } else {
          this.recentNotes = [];
          this.olderNotes = [];
          this.hasMoreNotes = false;
          this.hasImportantNotes = false;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải ghi chú. Vui lòng thử lại sau.',
          life: 3000,
        });
        this.isLoading = false;
        this.recentNotes = [];
        this.olderNotes = [];
      },
    });
  }

  openNoteEditor(): void {
    // Navigate to note creation page
    this.router.navigateByUrl('/notes/create');
  }

  editNote(note: NoteResponse): void {
    // Navigate to note edit page
    this.router.navigateByUrl(`/notes/${note.note_id}`);
  }

  deleteNote(note: NoteResponse, event?: Event): void {
    if (event) {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Bạn có chắc chắn muốn xóa ghi chú này?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Xóa',
        rejectLabel: 'Hủy',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
          this.executeDeleteNote(note);
        },
      });
    } else {
      this.executeDeleteNote(note);
    }
  }

  private executeDeleteNote(note: NoteResponse): void {
    this.http.delete(`${environment.apiUrl}/note/${note.note_id}`).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Đã xóa ghi chú',
          life: 3000,
        });
        this.loadNotes();
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
  }
}
