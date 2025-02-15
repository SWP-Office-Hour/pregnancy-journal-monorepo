import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  protected readonly control = new FormControl<File[]>([]);
  insertImg = output<MediaResponse>();

  protected onFileChange(event: Event): void {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.insertImg.emit({
          media_id: new Date().getTime().toString(),
          media_url: reader.result as string,
        });
      };
    }
  }
}
