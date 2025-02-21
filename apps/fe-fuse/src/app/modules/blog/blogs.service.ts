import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogCreateRequest, BlogResponse, BlogUpdateRequest, CategoryResponse, TagResponse } from '@pregnancy-journal-monorepo/contract';
import { map, of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private _blog: BlogResponse;
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
          this._blogs = blogs || [];
          this._totalPage = total_page;
          return { blogs: this._blogs, totalPage: this._totalPage };
        }),
      );
  }

  updateBlog(blog: BlogUpdateRequest) {
    return this._httpClient
      .patch<BlogResponse>(environment.apiUrl + 'blogs', blog, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response: BlogResponse) => {
          this._blogs = this._blogs.map((blog) => {
            if (blog.blog_id === response.blog_id) {
              return response;
            }
            return blog;
          });
          return response;
        }),
      );
  }

  createBlog(blog: BlogCreateRequest) {
    return this._httpClient
      .post<BlogResponse>(environment.apiUrl + 'blogs', blog, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response: BlogResponse) => {
          return response;
        }),
      );
  }

  getBlogById(id: string) {
    const blogById = this._blogs?.find((blog) => blog.blog_id === id);
    if (!blogById) {
      return throwError(() => new Error('Blog not found'));
    }
    this._blog = blogById;
    return of(blogById);
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

  filterByCategory(category_id: string) {
    return this._blogs.filter((blog) => blog.category.category_id === category_id);
  }

  filterByQuery(query: string) {
    return this._blogs.filter((blog) => blog.title.toLowerCase().includes(query.toLowerCase()));
  }
}
