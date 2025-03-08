import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { FileUploadComponent } from '../../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../../common/image-preview/image-preview.component';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent, ImagePreviewComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  @Output() postCreated = new EventEmitter<any>();
  protected postForm: FormGroup;
  protected images: MediaResponse[] = [];
  isSubmitting = false;

  constructor(
    private _formBuilder: FormBuilder,
    protected dialogRef: MatDialogRef<CreatePostComponent>,
  ) {
    this.postForm = this._formBuilder.group({
      content: [''],
    });
  }

  insertImg(media: MediaResponse) {
    this.images.push(media);
  }

  deleteImg(mediaId: string) {
    this.images = this.images.filter((img) => img.media_id !== mediaId);
  }

  onSubmit() {
    this.postCreated.emit(this.postForm.value);
    this.dialogRef.close();
  }
}
