import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BlogResponseType, CategoryResponse, Tag } from '@pregnancy-journal-monorepo/contract';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BlogMasonryService {
  private limit = 9;

  constructor(private _httpClient: HttpClient) {}

  getBlogs(categoryId: string, page: number) {
    if (!categoryId) {
      return this._httpClient.get<{
        blogs: BlogResponseType[];
        total_page: number;
      }>(environment.apiUrl + 'blogs?limit=' + this.limit + '&page=' + page);
    } else {
      return this._httpClient.get<{
        blogs: BlogResponseType[];
        total_page: number;
      }>(environment.apiUrl + 'blogs/category/' + categoryId + '?limit=' + this.limit + '&page=' + page);
    }
  }

  getTrendBlogs() {
    return this._httpClient.get<{ blogs: BlogResponseType[]; total_page: number }>(environment.apiUrl + 'blogs');
  }

  getTagByChildId(childId: string) {
    return this._httpClient.get<Tag[]>(environment.apiUrl + 'tags/user/' + childId);
  }

  getBlogRecommendationByTagArray(tagIdArray: string[]) {
    return this._httpClient.post<{ blogs: BlogResponseType[] }>(environment.apiUrl + 'blogs/tag', { tag_id: tagIdArray });
  }

  getCategories() {
    return this._httpClient.get<CategoryResponse[]>(environment.apiUrl + 'categories');
  }
}
