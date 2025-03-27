import { ChildV2Service } from '../../core/children/child.v2.service';

import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogResponseType, CategoryResponse, ChildType, Status } from '@pregnancy-journal-monorepo/contract';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { PaginationComponent } from '../../common/pagination/pagination.component';
import { AuthService } from '../../core/auth/auth.service';
import { BlogMasonryService } from './blog-masonry.service';

interface Post {
  title: string;
  date: Date;
  image: string;
}

interface Category {
  name: string;
  isSelected: boolean;
}

interface Tag {
  name: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-blog-masonry',
  imports: [RouterLink, DatePipe, CommonModule, NgClass, BreadcrumbModule, PaginationComponent],
  templateUrl: './blog-masonry.component.html',
  styleUrl: './blog-masonry.component.css',
})
export class BlogMasonryComponent implements OnInit {
  blogs: BlogResponseType[] = [];
  categories: CategoryResponse[] = [];
  items: MenuItem[] | undefined;
  selectedCategory: string = '';
  recommendedBlogs: BlogResponseType[] = [];
  child: ChildType;

  // Properties to track the currently displayed featured blogs
  featuredMainBlog: BlogResponseType | null = null;
  featuredLeftBlogs: BlogResponseType[] = [];
  featuredRightBlogs: BlogResponseType[] = [];

  currentPage = 1;
  itemsPerPage = 6; // Display 6 blog posts per page
  totalPages = 0;
  trendingNews: BlogResponseType[] = [];
  tickerPosition = 0;
  //   gallery
  currentIndex = 0;
  carouselItems: BlogResponseType[] = [];
  isInputFocused = false;
  private tickerInterval: any;
  private autoSlideInterval: any;

  constructor(
    private blogService: BlogMasonryService,
    private _authService: AuthService,
    private childService: ChildV2Service,
  ) {}

  ngOnInit(): void {
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
    this.loadTrendBlogs();
    this.loadCategories();
    this.loadBlogs();
    this.loadRecommendedBlogs();
    this.startTicker();
    this.startAutoSlide();
    this.items = [
      { icon: 'pi pi-home', route: '/home' },
      { label: 'Bài viết', route: '/authenticated/blog' },
    ];
  }

  loadRecommendedBlogs(): void {
    // Get tags for the child

    this.blogService.getTagByChildId(this.child.child_id).subscribe((response) => {
      if (response) {
        // Extract tag IDs
        const tagIds = response.map((tag) => tag.tag_id);
        // Get blog recommendations based on tags
        this.blogService.getBlogRecommendationByTagArray(tagIds).subscribe((result) => {
          console.log(result);
          this.recommendedBlogs = result.blogs;
          // If no recommendations, fall back to regular blogs
          if (!this.recommendedBlogs || this.recommendedBlogs.length === 0) {
            this.recommendedBlogs = [...this.blogs].slice(0, 5);
          }
        });
      } else {
        // Fallback if no tags
        this.recommendedBlogs = [...this.blogs].slice(0, 5);
      }
    });
  }

  // loadBlogs(categoryId: string = ''): void {
  //   // Replace with your actual API call
  //   this.blogService.getBlogs(categoryId, this.currentPage).subscribe((data) => {
  //     this.totalPages = data.total_page;
  //     this.blogs = data.blogs;
  //     this.updateFeaturedBlogs();
  //     console.log(this.blogs);
  //   });
  // }

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

  loadTrendBlogs(): void {
    // Replace with your actual API call
    this.blogService.getTrendBlogs().subscribe((data) => {
      this.carouselItems = data.blogs.slice(0, 5);
      this.trendingNews = data.blogs.slice(5, 10);
    });
  }

  // Method to update the featured blogs when the blog list changes
  updateFeaturedBlogs(): void {
    this.featuredMainBlog = this.blogs.length > 0 ? this.blogs[0] : null;
    this.featuredLeftBlogs = this.blogs.length > 1 ? this.blogs.slice(1, 3) : [];
    this.featuredRightBlogs = this.blogs.length > 3 ? this.blogs.slice(3, 5) : [];
  }

  loadCategories() {
    this.blogService.getCategories().subscribe((data: CategoryResponse[]) => {
      this.categories = data.filter((c) => c.status == Status.ACTIVE);
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadBlogs(categoryId);
  }

  isLandingPage() {
    return !this._authService.accessToken;
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
    this.currentIndex = (this.currentIndex + 1) % this.carouselItems.length;
  }

  prevSlide() {
    this.currentIndex = this.currentIndex === 0 ? this.carouselItems.length - 1 : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  handleImageError(event: any) {
    event.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167';
  }

  handleImageErrorV2(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a'; // placeholder image
  }

  // Get paginated blog posts for the current page

  // Handle page change from pagination component
  handlePageChange(page: number): void {
    this.currentPage = page;
    this.loadBlogs(this.selectedCategory);
    // Scroll to top of the blog section for better UX
    window.scrollTo({
      top: document.querySelector('.blog-masonry-section')?.getBoundingClientRect().top + window.pageYOffset - 100,
      behavior: 'smooth',
    });
  }

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.tickerPosition--;
      if (this.tickerPosition < -1000) {
        this.tickerPosition = 0;
      }
    }, 30);
  }

  calculateReadingTime(content: string): number {
    // Remove HTML tags and replace &nbsp; with a space
    let text = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');

    // Split into words by whitespace and filter out empty strings
    let words = text.split(/\s+/).filter((word) => word.length > 0);

    // Get the word count
    let wordCount = words.length;

    // Define reading speed (words per minute)
    let readingSpeed = 200;

    // Calculate time in minutes
    let time = wordCount / readingSpeed;

    // Round up to the nearest whole number
    return Math.ceil(time);
  }
  // getPaginatedBlogs(): any[] {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   return this.newsCategories.slice(startIndex, endIndex);
  // }

  // tags: Tag[] = [
  //   { name: 'JavaScript', isSelected: false },
  //   { name: 'React', isSelected: false },
  //   { name: 'Angular', isSelected: false },
  //   { name: 'Vue', isSelected: false },
  //   { name: 'TypeScript', isSelected: false },
  //   { name: 'Node.js', isSelected: false },
  //   { name: 'Python', isSelected: false },
  //   { name: 'CSS', isSelected: false },
  // ];

  // toggleTag(tag: Tag): void {
  //   tag.isSelected = !tag.isSelected;
  // }
  // toggleCategory(category: Category): void {
  //   category.isSelected = !category.isSelected;
  // }
}
