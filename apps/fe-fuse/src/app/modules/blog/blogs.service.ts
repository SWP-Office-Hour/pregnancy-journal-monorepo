import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BlogsService {
  private _blogs: {
    id: string;
    title: string;
    author: string;
    summary: string;
    content_url: string;
    category: string;
  }[] = [];

  /**
   * Constructor
   */
  constructor(private _httpClient: HttpClient) {}

  getBlogs() {
    return this._httpClient.get('api/dashboards/blogs').pipe(
      map((response: any) => {
        this._blogs = response;
        return this._blogs;
      }),
    );
  }

  createBlog(blog: { title: string; author: string; summary: string; content: string; category: string }) {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      summary: blog.summary,
      content_url: 'api/content/',
      category: blog.category,
    };
    return this._httpClient.post('api/dashboards/blogs', newBlog).pipe(
      map((response) => {
        return response;
      }),
    );
  }

  getContent() {
    return this._httpClient.get('api/content/').pipe(
      map((response: any) => {
        return response;
      }),
    );
  }
}
