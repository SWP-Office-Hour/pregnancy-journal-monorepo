import { Component, output, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { map, Subject } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  imports: [ReactiveFormsModule, TuiFiles],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  uploadFiles = output<TuiFileLike>();
  @ViewChild('imgPreview') imgPreview!: HTMLDivElement;

  protected files: TuiFileLike[] = [];
  protected readonly control = new FormControl<TuiFileLike | null>(null, [Validators.required]);
  // protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  // protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  // protected readonly loadedFiles$ = this.control.valueChanges.pipe(
  //   map((file: TuiFileLike | null) => this.processFile(file)),
  // );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  // protected processFile(file: TuiFileLike | null): TuiFileLike | null {
  //   this.loadingFiles$.next(file);
  //   if (!file) {
  //     this.failedFiles$.next(null);
  //     this.failedFiles$.next(file);
  //     return null;
  //   } else {
  //     this.loadingFiles$.next(null);
  //     this.failedFiles$.next(null);
  //     return file;
  //   }
  // }

  protected onFileChange(): void {
    // this.loadedFiles$.subscribe({
    //   next: (file) => {
    //     if (file) {
    //       this.uploadFiles.emit(file);
    //     }
    //   },
    // });
  }
}
