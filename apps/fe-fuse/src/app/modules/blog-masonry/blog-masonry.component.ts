import { CommonModule, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogResponseType, CategoryResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { AuthService } from '../../core/auth/auth.service';
import { BlogMasonryService } from './blog-masonry.service';

@Component({
  selector: 'app-blog-masonry',
  imports: [CommonModule, NgClass, RouterLink, PaginatorModule],
  templateUrl: './blog-masonry.component.html',
  styleUrl: './blog-masonry.component.css',
})
export class BlogMasonryComponent implements OnInit, OnDestroy {
  blogs: BlogResponseType[] = [];
  categories: CategoryResponse[] = [];

  selectedCategory: string = '';

  // Properties to track the currently displayed featured blogs
  featuredMainBlog: BlogResponseType | null = null;
  featuredLeftBlogs: BlogResponseType[] = [];
  featuredRightBlogs: BlogResponseType[] = [];
  trendingNews: BlogResponseType[] = [];
  tickerPosition = 0;
  //   gallery
  currentIndex = 0;
  carouselItems: BlogResponseType[] = [];
  // Blog pagination
  totalPage = 0;
  currentPage = 1;
  private tickerInterval: any;
  private autoSlideInterval: any;

  constructor(
    private blogService: BlogMasonryService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadTrendBlogs();
    this.loadCategories();
    this.loadBlogs();
    this.startTicker();
    this.startAutoSlide();
  }

  loadBlogs(categoryId: string = ''): void {
    // Replace with your actual API call
    this.blogService.getBlogs(categoryId, this.currentPage).subscribe((data) => {
      this.blogs = data.blogs;
      this.totalPage = data.total_page;
      console.log('total page of blogs', this.totalPage);
      this.updateFeaturedBlogs();
    });
  }

  loadTrendBlogs(): void {
    // Replace with your actual API call
    this.blogService.getTrendBlogs().subscribe((data) => {
      this.carouselItems = data.blogs.slice(0, 4);
      this.trendingNews = data.blogs.slice(4, 8);
    });
  }

  // Method to update the featured blogs when the blog list changes
  updateFeaturedBlogs(): void {
    this.featuredMainBlog = this.blogs.length > 0 ? this.blogs[0] : null;
    this.featuredLeftBlogs = this.blogs.length > 1 ? this.blogs.slice(1, 3) : [];
    this.featuredRightBlogs = this.blogs.length > 3 ? this.blogs.slice(3, 5) : [];
  }

  // Method to check if we have enough blogs for the featured section
  onPageChange(event: PaginatorState): void {
    this.currentPage = event.page + 1;
    this.loadBlogs(this.selectedCategory);
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

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.tickerPosition--;
      if (this.tickerPosition < -1000) {
        this.tickerPosition = 0;
      }
    }, 30);
  }
}
