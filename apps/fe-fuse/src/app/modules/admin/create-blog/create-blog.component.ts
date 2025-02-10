import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-create-blog',
  imports: [CommonModule, ReactiveFormsModule, MatButton, MatFormField, MatIcon, MatIconButton, MatInput, MatLabel, QuillEditorComponent],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css',
})
export class CreateBlogComponent implements OnInit {
  createBlogForm: UntypedFormGroup;
  quillModules: any = {
    toolbar: [['bold', 'italic', 'underline'], [{ align: [] }, { list: 'ordered' }, { list: 'bullet' }], ['clean']],
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
      created_at: [''],
      updated_at: [''],
      tags: [''],
      body: ['', [Validators.required]],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Save and close
   */
  saveAndClose(): void {
    // Save the message as a draft
    this.saveAsDraft();
  }

  /**
   * Discard the message
   */
  discard(): void {}

  /**
   * Save the message as a draft
   */
  saveAsDraft(): void {}

  /**
   * Send the message
   */
  send(): void {}
}
