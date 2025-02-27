import { CommonModule, DatePipe, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogResponseType } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-blog-detail',
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent implements OnInit {
  blogId: string = '';
  blog: BlogResponseType | null = null;
  relatedBlogs: BlogResponseType[] = [];
  loading: boolean = true;
  sanitizedContent: SafeHtml = '';
  url = window.location.href;

  constructor(
    private route: ActivatedRoute,
    private _http: HttpClient,
    private sanitizer: DomSanitizer,
    private location: Location,
    private metaService: Meta,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.blogId = params.get('id') || '';
      if (this.blogId) {
        this.loadBlogDetails();
      } else {
        this.loading = false;
      }
    });
  }

  loadBlogDetails(): void {
    this.loading = true;

    // Replace with your actual API call
    this._http.get<BlogResponseType>(environment.apiUrl + 'blogs/' + this.blogId).subscribe(
      (data) => {
        this.blog = data;

        // Sanitize HTML content to prevent XSS attacks but allow HTML rendering
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.blog.content);
        this.titleService.setTitle(this.blog.title);
        this.updateMetaTags();

        // Load related articles
        this.loadRelatedBlogs();
        this.loading = false;
      },
      (error: any) => {
        console.error('Error loading blog:', error);
        this.loading = false;
        this.blog = null;
      },
    );
  }

  updateMetaTags(): void {
    if (!this.blog) return;

    // Clear any existing og tags
    this.metaService.removeTag("property='og:url'");
    this.metaService.removeTag("property='og:type'");
    this.metaService.removeTag("property='og:title'");
    this.metaService.removeTag("property='og:description'");
    this.metaService.removeTag("property='og:image'");

    // Add Open Graph meta tags
    this.metaService.addTags([
      { property: 'og:url', content: this.url },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: this.blog.title },
      { property: 'og:description', content: this.blog.summary },
      { property: 'og:image', content: this.blog.blog_cover },
    ]);
  }

  getEncodedUrl(): string {
    return encodeURIComponent(this.url);
  }

  loadRelatedBlogs(): void {
    if (!this.blog) return;

    // Replace with your actual API call to get related blogs
    // Typically related by same category or tags
    this._http
      .get<{
        blogs: BlogResponseType[];
        total_page: number;
      }>(environment.apiUrl + 'blogs/category/' + this.blog.category.category_id)
      .subscribe(
        (data) => {
          this.relatedBlogs = data.blogs.slice(0, 3); // Limit to 3 related articles
        },
        (error: any) => {
          console.error('Error loading related blogs:', error);
        },
      );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  goBack(): void {
    // this.router.navigate(['/blogs']);
    this.location.back();
  }
}
