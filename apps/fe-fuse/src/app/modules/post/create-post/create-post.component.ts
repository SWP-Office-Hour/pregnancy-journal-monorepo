import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MediaResponse } from '@pregnancy-journal-monorepo/contract';
import { FileUploadComponent } from '../../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../../common/image-preview/image-preview.component';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';

@Component({
  selector: 'app-create-post',
  imports: [CommonModule, ReactiveFormsModule, FileUploadComponent, ImagePreviewComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  protected postForm: FormGroup;
  protected images: MediaResponse[] = [];
  isSubmitting = false;
  user: User;

  constructor(
    private _formBuilder: FormBuilder,
    protected dialogRef: MatDialogRef<CreatePostComponent>,
    private _userService: UserService,
  ) {
    this.postForm = this._formBuilder.group({
      content: [''],
    });

    this._userService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  insertImg(media: MediaResponse) {
    this.images.push(media);
  }

  deleteImg(mediaId: string) {
    this.images = this.images.filter((img) => img.media_id !== mediaId);
  }

  onSubmit() {
    this.dialogRef.close({ content: this.postForm.value, images: this.images });
  }

  getUserAvatar() {
    const prefix = 'https://api.dicebear.com/9.x/initials/svg?seed=';
    return this.user.avatar || prefix + this.user!.name!.charAt(0);
  }
}
