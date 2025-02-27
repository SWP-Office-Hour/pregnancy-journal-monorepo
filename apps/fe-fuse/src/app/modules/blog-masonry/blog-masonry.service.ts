import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogResponseType, CategoryResponse } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BlogMasonryService {
  constructor(private _httpClient: HttpClient) {}

  getBlogs(categoryId: string) {
    return this._httpClient.get<{ blogs: BlogResponseType[]; total_page: number }>(environment.apiUrl + 'blogs');
  }

  getCategories() {
    return this._httpClient.get<CategoryResponse[]>(environment.apiUrl + 'categories');
  }
}
