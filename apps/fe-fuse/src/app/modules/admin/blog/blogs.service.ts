import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  BlogCreateRequestType,
  BlogResponseType,
  BlogUpdateRequestType,
  CategoryResponse,
  MediaResponse,
  TagResponse,
} from '@pregnancy-journal-monorepo/contract';
import { map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private _blog: BlogResponseType | null;
  private _blogs: BlogResponseType[];
  private _tags: TagResponse[];
  private _categories: CategoryResponse[];
  private _page = 1;
  private _totalPage: number;
  private _media = signal<MediaResponse>({ media_url: '' });

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService,
  ) {}

  get Media() {
    return this._media;
  }

  getBlog() {
    return this._blog;
  }

  clearBlog() {
    this._blog = null;
  }

  getBlogs() {
    return this._httpClient
      .get<{ blogs: BlogResponseType[]; total_page: number }>(environment.apiUrl + 'blogs', {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
        params: {
          page: this._page,
        },
      })
      .pipe(
        map(({ blogs, total_page }: { blogs: BlogResponseType[]; total_page: number }) => {
          this._blogs = blogs || [];
          this._totalPage = total_page;
          return { blogs: this._blogs, totalPage: this._totalPage };
        }),
      );
  }

  updateBlog(blog: BlogUpdateRequestType) {
    const updatedBlog: BlogUpdateRequestType = {
      ...blog,
      blog_cover: this._media[0]?.media_url || '',
    };
    return this._httpClient
      .patch<BlogResponseType>(environment.apiUrl + 'blogs', updatedBlog, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response: BlogResponseType) => {
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

  createBlog(blog) {
    const newBlog: BlogCreateRequestType = {
      ...blog,
      blog_cover: this._media().media_url || '',
    };
    return this._httpClient
      .post<BlogResponseType>(environment.apiUrl + 'blogs', newBlog, {
        headers: {
          Authorization: 'Bearer ' + this._authService.accessToken,
        },
      })
      .pipe(
        map((response: BlogResponseType) => {
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
    this._media.set({ media_url: this._blog.blog_cover || '', media_id: Date.now().toString() });
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

  deleteImage(id: string) {
    if (this._media().media_id == id) {
      this._media.set({ media_url: '', media_id: '' });
    }
    return this._media;
  }

  addImage(img: MediaResponse) {
    this._media.set(img);
  }

  deleteBlog(id: string) {
    return this._httpClient.delete(environment.apiUrl + 'blogs/' + id, {
      headers: {
        Authorization: 'Bearer ' + this._authService.accessToken,
      },
    });
  }
}
