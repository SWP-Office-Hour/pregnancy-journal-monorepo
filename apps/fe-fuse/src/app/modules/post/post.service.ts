import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostCreateType, PostType } from '@pregnancy-journal-monorepo/contract';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private _httpClient: HttpClient) {}

  private _posts: PostType[] = [];

  get posts(): PostType[] {
    return this._posts;
  }

  getPosts() {
    return this._httpClient.get<PostType[]>(environment.apiUrl + 'posts').pipe(
      map((res) => {
        this._posts = res;
        return res;
      }),
    );
  }

  createPost(post: PostCreateType) {
    return this._httpClient.post<PostType>(environment.apiUrl + 'posts', post).pipe(
      map((res) => {
        this._posts.push(res);
        return res;
      }),
    );
  }

  deletePost(postId: string) {
    return this._httpClient.delete(environment.apiUrl + 'posts/' + postId).pipe(
      map((res) => {
        this._posts = this._posts.filter((post) => post.post_id !== postId);
        return res;
      }),
    );
  }
}
