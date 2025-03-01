import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, SafeHtml, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    private metaService: Meta,
    private titleService: Title,
    private router: Router,
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
        this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.styleHtmlWithTailwind(this.blog.content));
        console.log(this.blog.content);
        this.titleService.setTitle(this.blog.title || 'Blog Detail');
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

  styleHtmlWithTailwind(content) {
    content = content.replaceAll('&nbsp;', ' ');

    // Style headings with improved typography and responsive sizing
    content = content.replaceAll(
      /<h1>(.*?)<\/h1>/g,
      '<h1 class="text-3xl md:text-4xl lg:text-5xl font-extrabold mt-10 mb-6 text-gray-900 leading-tight tracking-tight">$1</h1>',
    );
    content = content.replaceAll(
      /<h2>(.*?)<\/h2>/g,
      '<h2 class="text-2xl md:text-3xl font-bold mt-8 mb-5 text-gray-900 leading-snug border-b border-gray-100 pb-2">$1</h2>',
    );
    content = content.replaceAll(/<h3>(.*?)<\/h3>/g, '<h3 class="text-xl md:text-2xl font-semibold mt-7 mb-4 text-gray-800 leading-relaxed">$1</h3>');
    content = content.replaceAll(/<h4>(.*?)<\/h4>/g, '<h4 class="text-lg md:text-xl font-medium mt-6 mb-3 text-gray-800">$1</h4>');

    // Enhanced paragraph styling with better readability
    content = content.replaceAll(/<p>(.*?)<\/p>/g, '<p class="mb-6 text-gray-700 leading-relaxed text-base md:text-lg">$1</p>');

    // Enhanced list styling with better spacing and bullet styling
    content = content.replaceAll(/<ul>(.*?)<\/ul>/gs, '<ul class="list-disc ml-6 mb-6 space-y-2 text-gray-700">$1</ul>');
    content = content.replaceAll(/<ol>(.*?)<\/ol>/gs, '<ol class="list-decimal ml-6 mb-6 space-y-2 text-gray-700">$1</ol>');
    content = content.replaceAll(/<li>(.*?)<\/li>/g, '<li class="mb-1 pl-1">$1</li>');

    // Improved blockquotes with more elegant styling
    content = content.replaceAll(
      /<blockquote>(.*?)<\/blockquote>/gs,
      '<blockquote class="border-l-4 border-indigo-500 pl-5 italic text-gray-700 my-6 bg-indigo-50 p-5 rounded-r-lg shadow-sm">$1</blockquote>',
    );

    // Enhanced link styling with better hover effects
    content = content.replaceAll(
      /<a(.*?)>(.*?)<\/a>/g,
      '<a$1 class="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-200 ease-in-out border-b border-indigo-200 hover:border-indigo-500">$2</a>',
    );

    // Enhanced code blocks with better syntax highlighting appearance
    content = content.replaceAll(
      /<pre>(.*?)<\/pre>/gs,
      '<pre class="bg-gray-800 text-gray-100 p-5 rounded-lg overflow-x-auto my-6 font-mono text-sm leading-relaxed shadow-md">$1</pre>',
    );
    content = content.replaceAll(
      /<code>((?!<\/pre>).)*?<\/code>/gs,
      '<code class="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-600">$1</code>',
    );

    // Make sure code inside pre tags doesn't get double-styled
    content = content.replaceAll(
      /<pre class=".*?"><code class=".*?">(.*?)<\/code><\/pre>/gs,
      '<pre class="bg-gray-800 text-gray-100 p-5 rounded-lg overflow-x-auto my-6 font-mono text-sm leading-relaxed shadow-md"><code class="bg-transparent p-0 text-gray-100">$1</code></pre>',
    );

    // Enhanced responsive image styling
    content = content.replaceAll(/<img(.*?)>/g, '<img$1 class="max-w-full md:max-w-[80%] lg:max-w-[70%] h-auto rounded-lg my-6 shadow-md mx-auto">');

    // Enhanced table styling with better borders and hover effects
    content = content.replaceAll(
      /<table>(.*?)<\/table>/gs,
      '<table class="w-full border-collapse my-6 bg-white shadow-sm rounded-lg overflow-hidden">$1</table>',
    );
    content = content.replaceAll(
      /<th>(.*?)<\/th>/g,
      '<th class="bg-gray-100 p-3 text-left font-semibold border border-gray-200 text-gray-700">$1</th>',
    );
    content = content.replaceAll(/<td>(.*?)<\/td>/g, '<td class="p-3 border border-gray-200 text-gray-700">$1</td>');
    content = content.replaceAll(
      /<tr>((?!<\/thead>).)*?<\/tr>/g,
      '<tr class="even:bg-gray-50 hover:bg-gray-50 transition-colors duration-150">$1</tr>',
    );

    // Enhanced horizontal rule styling
    content = content.replaceAll(/<hr>/g, '<hr class="border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-10">');

    return content;
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
    this.router.navigate(['/blog']);
  }
}
