import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { NgxImageCompressService } from 'ngx-image-compress';
import { getBase64 } from '../blob.utils';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  insertImg = output<MediaResponse>();
  protected readonly control = new FormControl<File[]>([]);

  constructor(private imageCompress: NgxImageCompressService) {}

  protected onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];

    if (file) {
      getBase64(file).then((base64: string) => {
        this.imageCompress.compressFile(base64, 1, 50, 70).then(
          (result: string) => {
            this.insertImg.emit({
              media_id: new Date().getTime().toString(),
              media_url: result,
            });
          },
          (result: string) => {
            this.insertImg.emit({
              media_id: new Date().getTime().toString(),
              media_url: result,
            });
          }, //Cannot compress image
        );
      });
    }
  }
}
