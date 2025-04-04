import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { BlogResponseType, BlogUpdateRequestType, CategoryResponse, MediaResponse, TagResponse } from '@pregnancy-journal-monorepo/contract';
import { QuillEditorComponent } from 'ngx-quill';
import { imageCompressor } from 'quill-image-compress';

import { MessageService } from 'primeng/api';
import { FileUploadComponent } from '../../../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../../../common/image-preview/image-preview.component';
import { BlogsService } from '../blogs.service';

@Component({
  selector: 'app-create-blog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    MatFormFieldModule,
    MatIcon,
    MatIconButton,
    MatInput,
    QuillEditorComponent,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelect,
    FileUploadComponent,
    ImagePreviewComponent,
    FormsModule,
  ],
  providers: [MessageService],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogEditorComponent implements OnInit {
  imageCompressImplementation = imageCompressor;
  blogEditorForm: FormGroup;
  @ViewChild('tagsInput') tags: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  tagsChips = signal<TagResponse[]>([]);
  tagsOptions: TagResponse[] = [];
  categories: CategoryResponse[] = [];
  image = signal<MediaResponse>({ media_url: '' });
  imageByUrl = signal<string>('');
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'],
    ],
    imageCompress: {
      quality: 0.7, // default
      maxWidth: 500, // default
      maxHeight: 500, // default
      imageType: 'image/jpeg', // default
      debug: false, // default
    },
  };
  protected _blog: BlogResponseType | null;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _blogService: BlogsService,
    private _msgService: MessageService,
    private _router: Router,
  ) {
    this._blogService.getTags().subscribe((tags) => {
      this.tagsOptions = tags;
    });
    this._blogService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this._blog = this._blogService.getBlog();
    this.image = this._blogService.Media;

    effect(() => {
      try {
        const url = new URL(this.imageByUrl());
        this.imageByUrl.set(url.href);
        this._blogService.addImage({ media_id: Date.now().toString(), media_url: url.href });
      } catch (error) {
        return;
      }
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.blogEditorForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      author: [''],
      summary: [''],
      category_id: [''],
      tags: [[]],
      body: ['', [Validators.required]],
    });
    if (this._blog) {
      this.blogEditorForm.patchValue({
        title: this._blog.title,
        author: this._blog.author,
        summary: this._blog.summary,
        body: this._blog.content,
        category_id: this._blog.category.category_id,
        tags: this._blog.tags,
      });
      this._blog.tags!.forEach((tag) => {
        this.tagsChips().push(tag!);
      });
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  saveAndClose(): void {
    // Save the message as a draft
    this._router.navigateByUrl('/admin/blog');
  }

  discard(): void {
    this.blogEditorForm.reset();
  }

  send(): void {
    console.log(this.blogEditorForm.value);
  }

  removeTag(tag: TagResponse): void {
    this.tagsChips.set(this.tagsChips().filter((t: TagResponse) => t.tag_id !== tag.tag_id));
    this.blogEditorForm.get('tags')!.setValue(this.tagsChips());
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (!this.tagsChips().some((t) => t.tag_id === value.id)) {
      this.tagsChips().push(value);
      this.blogEditorForm.get('tags')!.setValue(this.tagsChips());
    }

    this.tags.nativeElement.value = '';
  }

  isTagSelected(tag: TagResponse) {
    return this.tagsChips().some((t) => t.tag_id === tag.tag_id);
  }

  deleteImage(id: string) {
    this._blogService.deleteImage(id);
    this.imageByUrl.set('');
  }

  addImage(img: MediaResponse) {
    this._blogService.addImage(img);
  }

  // -----------------------------------------------------------------------------------------------------

  submit(): void {
    if (!this._blog) {
      const blogCreateData = {
        title: this.blogEditorForm.value.title,
        author: this.blogEditorForm.value.author,
        summary: this.blogEditorForm.value.summary,
        content: this.blogEditorForm.value.body,
        category_id: this.blogEditorForm.value.category_id,
        tags_id: this.blogEditorForm.value.tags.map((tag: TagResponse) => tag.tag_id),
      };
      this._blogService.createBlog(blogCreateData).subscribe({
        next: () => {
          this._msgService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Tạo blog thành công`,
            life: 3000,
          });
          this._router.navigateByUrl('/admin/blog');
        },
        error: (error) => {
          console.log(error);
          this._msgService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tạo Blog không thành công',
            life: 3000,
          });
        },
      });
    } else {
      const blogUpdateData: BlogUpdateRequestType = {
        title: this.blogEditorForm.value.title,
        author: this.blogEditorForm.value.author,
        blog_id: this._blog.blog_id,
        category_id: this.blogEditorForm.value.category_id,
        summary: this.blogEditorForm.value.summary,
        content: this.blogEditorForm.value.body,
        tags_id: this.blogEditorForm.value.tags.map((tag: TagResponse) => tag.tag_id),
      };
      this._blogService.updateBlog(blogUpdateData).subscribe({
        next: () => {
          this._msgService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Chỉnh sửa blog thành công`,
            life: 3000,
          });
          this._router.navigateByUrl('/admin/blog');
        },
        error: (error) => {
          console.log(error);
          this._msgService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tạo Blog không thành công',
            life: 3000,
          });
        },
      });
    }
  }

  deleteBlog(): void {
    if (this._blog) {
      this._blogService.deleteBlog(this._blog.blog_id).subscribe({
        next: () => {
          this._msgService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Xóa blog thành công`,
            life: 3000,
          });
          this._router.navigateByUrl('/admin/blog');
        },
        error: (error) => {
          console.log(error);
          this._msgService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Tạo Blog không thành công',
            life: 3000,
          });
        },
      });
    }
  }
}
