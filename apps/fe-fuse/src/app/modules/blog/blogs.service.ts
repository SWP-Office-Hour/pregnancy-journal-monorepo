import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogResponse, CategoryResponse, TagResponse } from '@pregnancy-journal-monorepo/contract';
import { map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private _blog: BlogResponse | any;
  private _blogs: BlogResponse[];
  private _tags: TagResponse[];
  private _categories: CategoryResponse[];
  private _page = 1;
  private _totalPage: number;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  getBlog() {
    return this._blog;
  }

  getBlogs() {
    return this._httpClient
      .get<{ blogs: BlogResponse[]; total_page: number }>(environment.apiUrl + 'blogs', {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
        params: {
          page: this._page,
        },
      })
      .pipe(
        map(({ blogs, total_page }: { blogs: BlogResponse[]; total_page: number }) => {
          this._blogs = blogs;
          this._totalPage = total_page;
          return { blogs: this._blogs, totalPage: this._totalPage };
        }),
      );
  }

  createBlog(blog: { title: string; author: string; summary: string; content: string; category: string }) {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      summary: blog.summary,
      content_url: blog.content,
      category: blog.category,
    };
    console.log(newBlog);
    return this._httpClient
      .post(environment.apiUrl + 'blogs', {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
        body: newBlog,
      })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  getBlogById(id: string) {
    if (this._blogs) {
      this._blog = this._blogs.find((blog) => blog.blog_id === id);
      return of(this._blog);
    } else {
      return throwError(() => new Error('Blog not found'));
    }
  }

  getContent() {
    return this._httpClient.get('api/content/').pipe(
      map((response: any) => {
        return response;
      }),
    );
  }

  getTags() {
    if (this._tags) {
      return of(this._tags);
    } else {
      return this._httpClient
        .get<TagResponse[]>(environment.apiUrl + 'tags', {
          headers: {
            Authorization: 'Bearer ' + this._authService.accessToken,
          },
        })
        .pipe(
          map((tags) => {
            this._tags = tags;
            return this._tags;
          }),
        );
    }
  }

  getCategories() {
    if (this._categories) {
      return of(this._categories);
    } else {
      return this._httpClient
        .get<CategoryResponse[]>(environment.apiUrl + 'categories', {
          headers: {
            Authorization: 'Bearer ' + this._authService.accessToken,
          },
        })
        .pipe(
          map((categories) => {
            this._categories = categories;
            return this._categories;
          }),
        );
    }
  }
}
