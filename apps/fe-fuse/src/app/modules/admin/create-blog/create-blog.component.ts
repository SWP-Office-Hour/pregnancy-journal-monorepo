import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';

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
  ],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBlogComponent implements OnInit {
  createBlogForm: UntypedFormGroup;
  @ViewChild('tagsInput') tags: ElementRef;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  tagsChips = signal<any[]>([
    {
      id: '1',
      title: 'Angular',
    },
    {
      id: '2',
      title: 'React',
    },
    {
      id: '3',
      title: 'Vue',
    },
  ]);
  tagsOptions = [
    {
      id: '1',
      title: 'Angular',
    },
    {
      id: '2',
      title: 'React',
    },
    {
      id: '3',
      title: 'Vue',
    },
    {
      id: '4',
      title: 'JavaScript',
    },
    {
      id: '5',
      title: 'TypeScript',
    },
    {
      id: '6',
      title: 'Node.js',
    },
    {
      id: '7',
      title: 'Express.js',
    },
    {
      id: '8',
      title: 'Next.js',
    },
    {
      id: '9',
      title: 'Nest.js',
    },
    {
      id: '10',
      title: 'Electron',
    },
    {
      id: '11',
      title: 'React Native',
    },
    {
      id: '12',
      title: 'Flutter',
    },
    {
      id: '13',
      title: 'Dart',
    },
    {
      id: '14',
      title: 'Java',
    },
    {
      id: '15',
      title: 'Spring Boot',
    },
    {
      id: '16',
      title: 'Kotlin',
    },
    {
      id: '17',
      title: 'Swift',
    },
    {
      id: '18',
      title: 'iOS',
    },
    {
      id: '19',
      title: 'Android',
    },
    {
      id: '20',
      title: 'Kotlin Multiplatform',
    },
  ];
  quillModules: any = {
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

  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder) {}

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

  add(event: MatChipInputEvent): void {
    if (!this.matAutocomplete.isOpen) {
      const value = event.value;
      // Add tag
      if (value) {
        this.tagsChips.update((tags) => [...tags, { id: '', title: value }]);
      }
    }
    event.chipInput!.clear();
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (!this.tagsChips().some((t) => t.id === value.id)) {
      this.tagsChips().push(value);
    }

    this.tags.nativeElement.value = '';
  }

  isTagSelected(tag) {
    return this.tagsChips().some((t) => t.id === tag.id);
  }
}
