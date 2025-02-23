import { TextFieldModule } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, resource, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Blog, Status } from '@pregnancy-journal-monorepo/contract';
import { ButtonModule } from 'primeng/button';
import { Carousel } from 'primeng/carousel';
import { blogsMockData } from '../../../../../../mockapi-express/src/blogs.mockapi';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-recommended-blogs',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonToggleModule,
    FormsModule,
    FuseCardComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatDividerModule,
    MatTooltipModule,
    Carousel,
    ButtonModule,
  ],
  templateUrl: './recommended-blogs.component.html',
  styleUrl: './recommended-blogs.component.css',
})
export class RecommendedBlogsComponent {
  protected blogs: Blog[] = [];
  protected readonly Status = Status;

  blogResource = resource<Blog[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'blogs', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  responsiveOptions: any[] | undefined;
  constructor() {
    this.blogs = blogsMockData;
    this.blogs = blogsMockData;
    console.log(this.blogs);
  }

  // private _fuseCards: QueryList<ElementRef>;
  //
  // filters: string[] = ['all', 'article', 'listing', 'list', 'info', 'shopping', 'pricing', 'testimonial', 'post', 'interactive'];
  // numberOfCards: any = {};
  // selectedFilter: string = 'all';
  //
  // /**
  //  * Constructor
  //  */
  // // constructor(private _renderer2: Renderer2) {}
  //
  // // -----------------------------------------------------------------------------------------------------
  // // @ Lifecycle hooks
  // // -----------------------------------------------------------------------------------------------------
  //
  // /**
  //  * After view init
  //  */
  // ngAfterViewInit(): void {
  //   // Calculate the number of cards
  //   this._calcNumberOfCards();
  //
  //   // Filter the cards for the first time
  //   this._filterCards();
  // }
  //
  // // -----------------------------------------------------------------------------------------------------
  // // @ Public methods
  // // -----------------------------------------------------------------------------------------------------
  //
  // /**
  //  * On filter change
  //  *
  //  * @param change
  //  */
  // onFilterChange(change: MatButtonToggleChange): void {
  //   // Set the filter
  //   this.selectedFilter = change.value;
  //
  //   // Filter the cards
  //   this._filterCards();
  // }
  //
  // // -----------------------------------------------------------------------------------------------------
  // // @ Private methods
  // // -----------------------------------------------------------------------------------------------------
  //
  // private _calcNumberOfCards(): void {
  //   // Prepare the numberOfCards object
  //   this.numberOfCards = {};
  //
  //   // Prepare the count
  //   let count = 0;
  //
  //   // Go through the filters
  //   this.filters.forEach((filter) => {
  //     // For each filter, calculate the card count
  //     if (filter === 'all') {
  //       count = this._fuseCards.length;
  //     } else {
  //       count = this.numberOfCards[filter] = this._fuseCards.filter((fuseCard) =>
  //         fuseCard.nativeElement.classList.contains('filter-' + filter),
  //       ).length;
  //     }
  //
  //     // Fill the numberOfCards object with the counts
  //     this.numberOfCards[filter] = count;
  //   });
  // }
  //
  // /**
  //  * Filter the cards based on the selected filter
  //  *
  //  * @private
  //  */
  // private _filterCards(): void {
  //   // Go through all fuse-cards
  //   this._fuseCards.forEach((fuseCard) => {
  //     // If the 'all' filter is selected...
  //     if (this.selectedFilter === 'all') {
  //       // Remove hidden class from all cards
  //       fuseCard.nativeElement.classList.remove('hidden');
  //     }
  //     // Otherwise...
  //     else {
  //       // If the card has the class name that matches the selected filter...
  //       if (fuseCard.nativeElement.classList.contains('filter-' + this.selectedFilter)) {
  //         // Remove the hidden class
  //         fuseCard.nativeElement.classList.remove('hidden');
  //       }
  //       // Otherwise
  //       else {
  //         // Add the hidden class
  //         fuseCard.nativeElement.classList.add('hidden');
  //       }
  //     }
  //   });
  // }
}
