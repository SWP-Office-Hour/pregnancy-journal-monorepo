import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { async, finalize, map, Observable, of, Subject, timer } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  imports: [AsyncPipe, NgIf, ReactiveFormsModule, TuiFiles],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  protected readonly control = new FormControl<TuiFileLike | null>(null, Validators.required);

  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    map((file: TuiFileLike | null) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  protected processFile(file: TuiFileLike | null): TuiFileLike | null {
    this.failedFiles$.next(null);

    if (this.control.invalid || !file) {
      return null;
    }

    this.loadingFiles$.next(file);

    return file;
  }
}
