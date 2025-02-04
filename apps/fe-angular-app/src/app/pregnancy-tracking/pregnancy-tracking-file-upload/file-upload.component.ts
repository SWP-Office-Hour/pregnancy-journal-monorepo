import { Component, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';

@Component({
  selector: 'app-file-upload',
  imports: [ReactiveFormsModule, TuiFiles],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  uploadFiles = output<TuiFileLike[]>();
  uploadFilesSrc = output<string[]>();

  currFile = signal<TuiFileLike | null>(null);

  protected imgSrcListSignal = signal<string[]>([]);

  protected filesSignal = signal<TuiFileLike[]>([]);
  protected readonly control = new FormControl<TuiFileLike | null>(null, [Validators.required]);

  protected onFileChange(): void {
    const reader = new FileReader();
    this.control.valueChanges.subscribe((file) => {
      if (file !== this.currFile()) {
        this.filesSignal().push(file!);
        reader.readAsDataURL(file as File);
        reader.onload = () => {
          this.imgSrcListSignal().push(reader.result as string);
        };
        this.currFile.set(file);
        this.uploadFiles.emit(this.filesSignal());
        this.uploadFilesSrc.emit(this.imgSrcListSignal());
      }
    });
  }
}
