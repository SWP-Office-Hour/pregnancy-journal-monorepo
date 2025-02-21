import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { BlogResponse, CategoryResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { FuseFindByKeyPipe } from '../../../@fuse/pipes/find-by-key';
import { BlogsService } from './blogs.service';

@Component({
  selector: 'app-blog',
  imports: [MatAnchor, MatIcon, RouterLink, CdkScrollable, MatFormField, MatInput, MatOption, MatPrefix, MatSelect, FuseFindByKeyPipe],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  protected blogs: BlogResponse[] = [];
  protected categories: CategoryResponse[] = [];
  protected filteredBlogs: BlogResponse[] = [];
  protected totalPage: number = 0;
  protected readonly Status = Status;

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
    const category_id = $event.value;
    if (!category_id || category_id === 'all') {
      this.filteredBlogs = this.blogs;
      return;
    }
    this.filteredBlogs = this._blogsService.filterByCategory(category_id);
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  filterByQuery(value: string) {
    this.filteredBlogs = this._blogsService.filterByQuery(value);
  }
}
