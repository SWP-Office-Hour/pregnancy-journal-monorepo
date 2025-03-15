import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogResponseType, CategoryResponse, Status } from '@pregnancy-journal-monorepo/contract';
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

  // Properties to track the currently displayed featured blogs
  featuredMainBlog: BlogResponseType | null = null;
  featuredLeftBlogs: BlogResponseType[] = [];
  featuredRightBlogs: BlogResponseType[] = [];

  constructor(
    private blogService: BlogMasonryService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBlogs();
    this.startTicker();
    this.startAutoSlide();
  }

  loadBlogs(categoryId: string = ''): void {
    // Replace with your actual API call
    this.blogService.getBlogs(categoryId).subscribe((data) => {
      this.blogs = data.blogs;
      this.updateFeaturedBlogs();
      console.log(this.blogs);
    });
  }

  // Method to update the featured blogs when the blog list changes
  updateFeaturedBlogs(): void {
    this.featuredMainBlog = this.blogs.length > 0 ? this.blogs[0] : null;
    this.featuredLeftBlogs = this.blogs.length > 1 ? this.blogs.slice(1, 3) : [];
    this.featuredRightBlogs = this.blogs.length > 3 ? this.blogs.slice(3, 5) : [];
  }

  // Method to check if we have enough blogs for the featured section
  hasFeaturedBlogs(): boolean {
    return this.blogs.length > 0;
  }

  // Get the main featured blog (first blog)
  getFeaturedMainBlog(): BlogResponseType | null {
    return this.featuredMainBlog;
  }

  // Get blogs for the left sidebar (second and third blogs)
  getLeftSidebarBlogs(): BlogResponseType[] {
    return this.featuredLeftBlogs;
  }

  // Get blogs for the right sidebar (fourth and fifth blogs)
  getRightSidebarBlogs(): BlogResponseType[] {
    return this.featuredRightBlogs;
  }

  loadCategories() {
    this.blogService.getCategories().subscribe((data: CategoryResponse[]) => {
      this.categories = data.filter((c) => c.status == Status.ACTIVE);
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

  featuredNews = {
    imageUrl: 'https://images.unsplash.com/photo-1495020689067-958852a7765e',
    headline: 'Breaking: Major Technology Breakthrough Reshapes Industry Landscape',
    preview: 'Revolutionary advancement in quantum computing promises to transform multiple sectors, experts say.',
    timestamp: new Date(),
    author: 'John Anderson',
  };

  trendingNews = [
    { title: 'Global Climate Summit Reaches Historic Agreement' },
    { title: 'New AI Discovery Promises Medical Breakthrough' },
    { title: 'Space Mission Successfully Lands on Mars' },
    { title: 'Economic Reform Package Announced' },
  ];

  newsCategories = [
    {
      name: 'Politics',
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620',
      headline: 'Major Policy Changes Announced',
      summary: 'Government unveils new legislative agenda for upcoming session.',
      readTime: 5,
    },
    {
      name: 'Technology',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      headline: 'Tech Giants Reveal New Innovation',
      summary: 'Latest developments in AI and machine learning showcase future possibilities.',
      readTime: 4,
    },
    {
      name: 'Sports',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
      headline: 'Championship Final Results',
      summary: 'Dramatic finish to season as underdogs claim victory.',
      readTime: 3,
    },
    {
      name: 'Entertainment',
      imageUrl: 'https://images.unsplash.com/photo-1603190287605-e6ade32fa852',
      headline: 'Award Show Highlights',
      summary: "Surprising wins and memorable moments from last night's ceremony.",
      readTime: 6,
    },
  ];

  tickerPosition = 0;
  private tickerInterval: any;

  ngOnDestroy() {
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
    }
    this.stopAutoSlide();
  }

  private startTicker() {
    this.tickerInterval = setInterval(() => {
      this.tickerPosition--;
      if (this.tickerPosition < -1000) {
        this.tickerPosition = 0;
      }
    }, 30);
  }

  //   gallery
  currentIndex = 0;
  private autoSlideInterval: any;

  carouselItems: BlogResponseType[] = [
    {
      blog_cover:
        'https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Breaking: Major Technology Breakthrough Announced',
      summary: 'Scientists reveal groundbreaking advancement in quantum computing that could revolutionize modern technology.',
      created_at: new Date(),
      author: 'John Smith',
    },
    {
      blog_cover:
        'https://images.unsplash.com/photo-1470116945706-e6bf5d5a53ca?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Global Climate Summit Reaches Historic Agreement',
      summary: 'World leaders unite to establish ambitious climate goals in landmark environmental accord.',
      created_at: new Date(),
      author: 'Sarah Johnson',
    },
    {
      blog_cover:
        'https://images.unsplash.com/photo-1511948374796-056e8f289f34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Economic Recovery Shows Promising Signs',
      summary: 'Markets respond positively to new economic measures as global recovery gains momentum.',
      created_at: new Date(),
      author: 'Michael Brown',
    },
  ];

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
}
