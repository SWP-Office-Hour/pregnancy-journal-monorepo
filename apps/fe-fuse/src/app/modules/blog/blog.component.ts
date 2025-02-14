import { CdkScrollable } from '@angular/cdk/scrolling';
import { I18nPluralPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Blog, CategoryRes } from '@pregnancy-journal-monorepo/contract';
import { FuseFindByKeyPipe } from '../../../@fuse/pipes/find-by-key';
import { BlogsService } from './blogs.service';

@Component({
  selector: 'app-blog',
  imports: [
    MatAnchor,
    MatIcon,
    RouterLink,
    CdkScrollable,
    FuseFindByKeyPipe,
    I18nPluralPipe,
    MatFormField,
    MatInput,
    MatOption,
    MatPrefix,
    MatProgressBar,
    MatSelect,
    MatSlideToggle,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  protected blogs: Blog[];
  protected categories: CategoryRes[];
  protected filteredBlogs: Blog[];
  protected totalPage: number;

  constructor(private _blogsService: BlogsService) {
    this._blogsService.getBlogs().subscribe(({ blogs, totalPage }) => {
      this.blogs = blogs;
      this.filteredBlogs = blogs;
      this.totalPage = totalPage;
    });
    this._blogsService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  filterByCategory($event: MatSelectChange) {
    console.log($event.value);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterByQuery(value: string) {
    console.log(value);
  }

  toggleInactive($event: MatSlideToggleChange) {
    console.log($event.checked);
  }
}
