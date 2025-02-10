import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { blogsData, contentData } from './data';

@Injectable({ providedIn: 'root' })
export class BlogsMockApi {
  private _blogs = blogsData;
  private _content: string = contentData;

  /**
   * Constructor
   */
  constructor(private _fuseMockApiService: FuseMockApiService) {
    // Register Mock API handlers
    this.registerHandlers();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register Mock API handlers
   */
  registerHandlers(): void {
    // -----------------------------------------------------------------------------------------------------
    // @ Sales - GET
    // -----------------------------------------------------------------------------------------------------
    this._fuseMockApiService.onGet('api/content/').reply(() => [200, cloneDeep(this._content)]);
    this._fuseMockApiService.onGet('api/dashboards/blogs').reply(() => [200, cloneDeep(this._blogs)]);
    this._fuseMockApiService.onGet('api/dashboards/blogs/1').reply(() => [200, cloneDeep(this._blogs[0])]);
    this._fuseMockApiService.onPost('api/dashboards/blogs').reply(({ request }) => {
      // Get the new blog
      const blog = cloneDeep(request.body);

      // Generate a new ID
      const newId = this._blogs.length + 10;

      const newBlog = {
        ...blog,
        category: {
          id: blog.category,
          title: 'Technology',
        },
        id: newId.toString(),
      };

      // Push the new blog
      this._blogs.push(newBlog);

      // Return the response
      return [200, newBlog];
    });
  }
}
