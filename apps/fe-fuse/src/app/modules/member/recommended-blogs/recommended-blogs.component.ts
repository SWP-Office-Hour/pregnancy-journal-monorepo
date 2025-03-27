import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { BlogResponseType, CategoryResponse } from '@pregnancy-journal-monorepo/contract';
import { MenuItem } from 'primeng/api';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { UserService } from '../../../core/user/user.service';
import { BlogMasonryService } from '../../blog-masonry/blog-masonry.service';
import { PregnancyRecordService } from '../../customer/pregnancy-record/pregnancy-record.service';

@Component({
  selector: 'app-recommended-blogs',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './recommended-blogs.component.html',
  styleUrl: './recommended-blogs.component.css',
})
export class RecommendedBlogsComponent {
  blogs: BlogResponseType[] = [];
  categories: CategoryResponse[] = [];
  items: MenuItem[] | undefined;
  recommendedBlogs: BlogResponseType[] = [];

  currentPage = 1;
  totalPages = 0;
  tickerPosition = 0;
  //   gallery
  currentIndex = 0;
  carouselItems: BlogResponseType[] = [];
  private tickerInterval: any;
  private autoSlideInterval: any;

  // Properties to track the currently displayed featured blogs
  featuredMainBlog: BlogResponseType | null = null;
  featuredLeftBlogs: BlogResponseType[] = [];
  featuredRightBlogs: BlogResponseType[] = [];

  constructor(
    private _recordService: PregnancyRecordService,
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _childService: ChildV2Service,
    private blogService: BlogMasonryService,
    private childService: ChildV2Service,
  ) {
    this.loadBlogs();
    this.loadRecommendedBlogs();
    this.startTicker();
    this.startAutoSlide();
  }

  // In home.component.ts
  loadRecommendedBlogs(): void {
    // Get tags for the child
    if (!this.child || !this.child.child_id) {
      console.log('No child data available yet');
      return;
    }

    this.blogService.getTagByChildId(this.child.child_id).subscribe((response) => {
      if (response) {
        // Extract tag IDs
        const tagIds = response.map((tag) => tag.tag_id);
        // Get blog recommendations based on tags
        this.blogService.getBlogRecommendationByTagArray(tagIds).subscribe((result) => {
          console.log('Recommended blogs loaded:', result);
          this.recommendedBlogs = result.blogs;
          this.carouselItems = this.recommendedBlogs; // Update carousel items too

          if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
            // Explicitly initialize the carousel
            this.currentIndex = 0;
          } else {
            // Fallback to regular blogs
            this.recommendedBlogs = [...this.blogs].slice(0, 5);
            this.carouselItems = this.recommendedBlogs;
          }
        });
      } else {
        // Fallback if no tags
        this.recommendedBlogs = [...this.blogs].slice(0, 5);
        this.carouselItems = this.recommendedBlogs;
      }
    });
  }

  loadBlogs(categoryId: string = ''): void {
    this.blogService.getBlogs(categoryId, this.currentPage).subscribe((data) => {
      this.totalPages = data.total_page;
      this.blogs = data.blogs;

      // Only use as fallback if recommendations haven't loaded
      if (this.recommendedBlogs.length === 0) {
        this.recommendedBlogs = [...this.blogs].slice(0, 5);
      }

      this.updateFeaturedBlogs();
    });
  }

  // Method to update the featured blogs when the blog list changes
  updateFeaturedBlogs(): void {
    this.featuredMainBlog = this.blogs.length > 0 ? this.blogs[0] : null;
    this.featuredLeftBlogs = this.blogs.length > 1 ? this.blogs.slice(1, 3) : [];
    this.featuredRightBlogs = this.blogs.length > 3 ? this.blogs.slice(3, 5) : [];
  }

  ngOnDestroy() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
    }
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.recommendedBlogs.length;
    }
  }

  prevSlide() {
    console.log(this.recommendedBlogs);
    console.log(this.currentIndex);
    if (this.recommendedBlogs && this.recommendedBlogs.length > 0) {
      this.currentIndex = this.currentIndex === 0 ? this.recommendedBlogs.length - 1 : this.currentIndex - 1;
    }
  }

  goToSlide(index: number) {
    if (this.recommendedBlogs && index >= 0 && index < this.recommendedBlogs.length) {
      this.currentIndex = index;
    }
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';
  }

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.tickerPosition--;
      if (this.tickerPosition < -1000) {
        this.tickerPosition = 0;
      }
    }, 30);
  }
}
