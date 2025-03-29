import { CommonModule, DatePipe } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BlogResponseType, ChildType } from '@pregnancy-journal-monorepo/contract';
import { NgxSplideModule } from 'ngx-splide';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { BlogMasonryService } from '../../blog-masonry/blog-masonry.service';

@Component({
  selector: 'app-recommended-blogs',
  standalone: true,
  imports: [CommonModule, NgxSplideModule, DatePipe, RouterModule],
  templateUrl: './recommended-blogs.component.html',
  styleUrl: './recommended-blogs.component.css',
})
export class RecommendedBlogsComponent implements OnInit {
  child: ChildType;
  isLoading = true;
  recommendedBlogs = signal<BlogResponseType[]>([]);
  constructor(
    private blogService: BlogMasonryService,
    private router: Router,
    private childService: ChildV2Service,
  ) {
    effect(() => {
      if (this.child) {
        this.loadRecommendedBlogs();
      }
    });
  }

  ngOnInit(): void {
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }

  loadRecommendedBlogs(): void {
    if (!this.child || !this.child.child_id) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    this.blogService.getTagByChildId(this.child.child_id).subscribe({
      next: (response) => {
        if (response && response.length) {
          // Extract tag IDs
          const tagIds = response.map((tag) => tag.tag_id);

          // Get blog recommendations based on tags
          this.blogService.getBlogRecommendationByTagArray(tagIds).subscribe({
            next: (result) => {
              this.recommendedBlogs.set(result.blogs);
              this.isLoading = false;

              // If we got fewer than 5 results, get additional general blogs
              if (this.recommendedBlogs.length < 5) {
                this.getAdditionalBlogs();
              }
            },
            error: (err) => {
              console.error('Error loading recommended blogs:', err);
              this.isLoading = false;
              this.getAdditionalBlogs();
            },
          });
        } else {
          // Fallback to general blogs if no tags
          this.getAdditionalBlogs();
        }
      },
      error: (err) => {
        console.error('Error loading child tags:', err);
        this.isLoading = false;
        this.getAdditionalBlogs();
      },
    });
  }

  getAdditionalBlogs(): void {
    // Fetch trending blogs as fallback
    this.blogService.getTrendBlogs().subscribe({
      next: (result) => {
        if (!this.recommendedBlogs().length) {
          this.recommendedBlogs.set(result.blogs);
        } else {
          // Add more blogs if we don't have enough, but avoid duplicates
          const existingIds = new Set(this.recommendedBlogs().map((blog) => blog.blog_id));
          const additionalBlogs = result.blogs.filter((blog) => !existingIds.has(blog.blog_id));

          // Add enough to reach 5 total, or all available if less
          this.recommendedBlogs.update((currentBlogs) => [...currentBlogs, ...additionalBlogs.slice(0, 5 - currentBlogs.length)]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading additional blogs:', err);
        this.isLoading = false;
      },
    });
  }
  navigateToBlog(blog: BlogResponseType): void {
    if (blog?.blog_id) {
      this.router.navigate(['/blog', blog.blog_id]);
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/images/ui/flo2/b_1.png';
  }
}
