import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Blog, CategoryRes, Tag } from '@pregnancy-journal-monorepo/contract';
import { QuillEditorComponent } from 'ngx-quill';
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
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBlogComponent implements OnInit {
  createBlogForm: FormGroup;
  @ViewChild('tagsInput') tags: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  tagsChips = signal<Tag[]>([]);
  tagsOptions: Tag[] = [];
  categories: CategoryRes[] = [];
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
  };
  protected _blog: Blog;

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _blogService: BlogsService,
  ) {
    this._blogService.getTags().subscribe((tags) => {
      this.tagsOptions = tags;
    });
    this._blogService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
    this._blog = this._blogService.getBlog();
    console.log(this._blog);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.createBlogForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      author: [''],
      summary: [''],
      category: [''],
      tags: [this.tagsChips()],
      body: ['', [Validators.required]],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  saveAndClose(): void {
    // Save the message as a draft
    this.saveAsDraft();
  }

  discard(): void {}

  saveAsDraft(): void {}

  send(): void {
    console.log(this.createBlogForm.value);
  }

  removeTag(tag: any): void {
    this.tagsChips.set(this.tagsChips().filter((t: any) => t.id !== tag.id));
    this.createBlogForm.get('tags').setValue(this.tagsChips());
    console.log(this.createBlogForm.get('tags').value);
  }

  tagSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (!this.tagsChips().some((t) => t.id === value.id)) {
      this.tagsChips().push(value);
    }

    this.tags.nativeElement.value = '';
  }

  isTagSelected(tag) {
    return this.tagsChips().some((t) => t.id === tag.id);
  }

  // -----------------------------------------------------------------------------------------------------

  submit(): void {
    this._blogService.createBlog(this.createBlogForm.value).subscribe((response: any) => {
      this._blogService.getContent().subscribe((content) => {
        const responseWithContent = {
          id: response.id,
          title: response.title,
          author: response.author,
          summary: response.summary,
          content,
        };
        console.log(responseWithContent);
      });
    });
  }
}
