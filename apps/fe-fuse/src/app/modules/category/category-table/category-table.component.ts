// noinspection ExceptionCaughtLocallyJS

import { NgIf } from '@angular/common';
import { Component, effect, OnInit, resource, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { Category, Status } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  animations: fuseAnimations,
  standalone: true,
  imports: [
    ConfirmPopupModule,
    TableModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    ToolbarModule,
    TableModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    NgIf,
    ConfirmPopup,
    SelectModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class CategoryTableComponent implements OnInit {
  // Constants
  protected readonly Status = Status;

  // Component state
  isLoading = false;
  categoryDialogToggle = false;
  isSubmittedForm = false;

  // Form
  categoryForm!: FormGroup;
  category!: Category;

  // ViewChild
  @ViewChild('dt') dt!: Table;

  // Resource
  categoryResource = resource<Category[], {}>({
    loader: async ({ abortSignal }) => {
      this.isLoading = true;
      try {
        const response = await fetch(`${environment.apiUrl}categories`, {
          signal: abortSignal,
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        this.notifyError(error);
        return [];
      } finally {
        this.isLoading = false;
      }
    },
  });

  /**
   * Constructor
   */
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {
    effect(() => {
      console.log('Categories loaded:', this.categoryResource.value());
    });
  }

  /**
   * Lifecycle Methods
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Public Methods
   */
  openNew(): void {
    this.categoryForm.reset({
      category_id: '',
      title: '',
      status: Status.INACTIVE,
    });
    this.isSubmittedForm = false;
    this.categoryDialogToggle = true;
  }

  hideDialog(): void {
    this.categoryDialogToggle = false;
    this.isSubmittedForm = false;
    this.categoryForm.reset();
  }

  saveCategory(event: Event): void {
    this.isSubmittedForm = true;
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const _category: Category = this.categoryForm.value;
    const isUpdate = !!_category.category_id;
    const actionType = isUpdate ? 'update' : 'create';
    const method = isUpdate ? 'PATCH' : 'POST';

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Are you sure you want to ${actionType} the category?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveCategoryToServer(_category, method, actionType);
      },
    });
  }

  editCategory(categoryToEdit: Category): void {
    this.categoryForm.patchValue({
      category_id: categoryToEdit.category_id,
      title: categoryToEdit.title,
      status: categoryToEdit.status,
    });

    this.category = { ...categoryToEdit };
    this.categoryDialogToggle = true;
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getSeverityStatus(status: Status): string {
    switch (status) {
      case Status.ACTIVE:
        return 'success';
      case Status.INACTIVE:
        return 'warn';
      default:
        return 'info';
    }
  }

  convertStatusToReadable(status: Status): string {
    switch (status) {
      case Status.ACTIVE:
        return 'ACTIVE';
      case Status.INACTIVE:
        return 'INACTIVE';
      default:
        return 'UNKNOWN';
    }
  }

  /**
   * Form accessor
   */
  get f(): { [key: string]: AbstractControl } {
    return this.categoryForm.controls;
  }

  /**
   * Private Methods
   */
  private initForm(): void {
    this.categoryForm = this.formBuilder.group({
      category_id: [''],
      title: ['', Validators.required],
      status: [Status.INACTIVE, Validators.required],
    });
  }

  private async saveCategoryToServer(category: Category, method: string, actionType: string): Promise<void> {
    this.isLoading = true;

    try {
      const response = await fetch(`${environment.apiUrl}categories`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()} category`);
      }

      const result = await response.json();
      console.log('Server response:', result);

      this.categoryDialogToggle = false;
      this.categoryForm.reset();
      this.category = {} as Category;
      this.categoryResource.reload();

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `Category ${actionType.charAt(0).toUpperCase() + actionType.slice(1) + 'd'}`,
        life: 4000,
      });
    } catch (error) {
      this.notifyError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private notifyError(error: any): void {
    console.error('Error in CategoryTableComponent:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'An unexpected error occurred',
      life: 4000,
    });
  }
}
