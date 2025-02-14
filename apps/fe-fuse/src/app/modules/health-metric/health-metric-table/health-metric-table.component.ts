import { AsyncPipe, CurrencyPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { MetricResponseType } from '@pregnancy-journal-monorepo/contract';
import { Observable, Subject } from 'rxjs';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';

@Component({
  selector: 'app-health-metric-table',
  templateUrl: './health-metric-table.component.html',
  styleUrl: './health-metric-table.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    AsyncPipe,
    MatProgressBarModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    NgTemplateOutlet,
    MatPaginatorModule,
    NgClass,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatRippleModule,
    AsyncPipe,
    CurrencyPipe,
  ],
})
export class HealthMetricTableComponent {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  metricList$: Observable<MetricResponseType[]>;
  //
  // brands: InventoryBrand[];
  // categories: InventoryCategory[];
  // filteredTags: InventoryTag[];
  // flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  // pagination: InventoryPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  // selectedProduct: InventoryProduct | null = null;
  // selectedProductForm: UntypedFormGroup;
  // tags: InventoryTag[];
  // tagsEditMode: boolean = false;
  // vendors: InventoryVendor[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    // private _inventoryService: InventoryService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create product
   */
  createMetric(): void {
    // Create the product
    // this._inventoryService.createProduct().subscribe((newProduct) => {
    //   // Go to new product
    //   this.selectedProduct = newProduct;
    //
    //   // Fill the form
    //   this.selectedProductForm.patchValue(newProduct);
    //
    //   // Mark for check
    //   this._changeDetectorRef.markForCheck();
    // });
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
