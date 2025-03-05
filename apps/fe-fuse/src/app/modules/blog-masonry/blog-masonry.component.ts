import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogResponseType, CategoryResponse } from '@pregnancy-journal-monorepo/contract';
import { AuthService } from '../../core/auth/auth.service';
import { BlogMasonryService } from './blog-masonry.service';

@Component({
  selector: 'app-blog-masonry',
  imports: [RouterLink, DatePipe, CommonModule, NgClass],
  templateUrl: './blog-masonry.component.html',
  styleUrl: './blog-masonry.component.css',
})
export class BlogMasonryComponent implements OnInit {
  blogs: BlogResponseType[] = [];
  categories: CategoryResponse[] = [];

  selectedCategory: string = '';

  constructor(
    private blogService: BlogMasonryService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBlogs();
  }

  loadBlogs(categoryId: string = ''): void {
    // Replace with your actual API call
    this.blogService.getBlogs(categoryId).subscribe((data) => {
      this.blogs = data.blogs;
    });
  }

  loadCategories() {
    this.blogService.getCategories().subscribe((data: CategoryResponse[]) => {
      this.categories = data;
    });
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.category_id == categoryId);
    return category ? category.title : 'Uncategorized';
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.loadBlogs(categoryId);
  }

  isLandingPage() {
    return !this._authService.accessToken;
  }
}
