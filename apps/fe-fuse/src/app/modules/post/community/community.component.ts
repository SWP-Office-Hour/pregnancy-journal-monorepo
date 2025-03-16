import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommentResponseType, PostType, ReactionResponseType } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { map } from 'rxjs';
import { FuseCardComponent } from '../../../../@fuse/components/card';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.types';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-community',
  imports: [
    CdkTextareaAutosize,
    FuseCardComponent,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    CommonModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent {
  @ViewChild('.search-results') postContainer: HTMLElement;
  protected user: User;
  // Infinite scroll properties
  protected lastPosts: PostType[] = [];
  protected posts = signal<PostType[]>([]);
  protected loading = false;
  protected page = 1;
  protected total = 0;
  private limit = 10;
  private loaded = 0;

  //End Infinite scroll properties

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private dialog: MatDialog,
  ) {
    this._userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.fetchPosts(this.page);
  }

  fetchPosts(page: number) {
    if (this.loading || (this.loaded >= this.total && this.loaded > 0)) {
      return;
    }
    this.loading = true;
    this._httpClient
      .get<{ total: number; data: PostType[] }>(environment.apiUrl + 'posts?page=' + page + '&limit=' + this.limit)
      .subscribe((body) => {
        this.total = body.total;
        this.loaded += body.data.length;
        if (this.posts().length > 0) {
          this.lastPosts = this.posts().slice(-this.limit);
        } else {
          this.lastPosts = this.posts();
        }
        this.posts.set([...this.posts().slice(-this.limit), ...body.data]);

        this.loading = false;
      });
  }

  onScroll() {
    this.page++;
    this.fetchPosts(this.page);
  }

  openRef() {
    this.dialog.open(CreatePostComponent);
  }

  createPostAt(date: string | Date): string {
    const dateObj = new Date(date);
    return DateTime.fromJSDate(dateObj).toLocaleString();
  }

  getAvatarUrl(user: { user_id: string; avatar?: string; name: string } | any) {
    const prefix = 'https://api.dicebear.com/9.x/initials/svg?seed=';
    return user.avatar || prefix + user.name.charAt(0);
  }

  isReacted(post: PostType, user: User) {
    return post.reaction.some((reaction) => reaction.user.user_id == this.user.user_id);
  }

  likePost(post: PostType) {
    console.log('like post ', post.post_id);
    this._httpClient
      .post<ReactionResponseType>(environment.apiUrl + 'reactions', { post_id: post.post_id })
      .pipe(
        map((res: ReactionResponseType) => {
          console.log(res);
          return res.post_id;
        }),
      )
      .subscribe((post_id) => {
        const index = this.posts().findIndex((p) => p.post_id === post_id);
        this._httpClient.get<PostType>(environment.apiUrl + 'posts/' + post_id).subscribe((post) => {
          console.log(this.posts()[index]);
          this.posts.update((posts) => {
            posts[index] = post;
            return posts;
          });
          console.log(this.posts()[index]);
        });
      });
  }

  unlikePost(post: PostType) {
    console.log('unlike post');
    this._httpClient
      .post<string>(environment.apiUrl + 'reactions/', { post_id: post.post_id })
      .pipe(
        map((res) => {
          return res;
        }),
      )
      .subscribe(() => {
        const index = this.posts().findIndex((p) => p.post_id === post.post_id);
        this._httpClient.get<PostType>(environment.apiUrl + 'posts/' + post.post_id).subscribe((newPost) => {
          this.posts.update((posts) => {
            posts[index] = newPost;
            return posts;
          });
        });
      });
  }

  commentPost(post_id: string, content: string) {
    console.log('comment post');
    this._httpClient
      .post<CommentResponseType>(environment.apiUrl + 'comments', { post_id, content })
      .pipe(
        map((res: CommentResponseType) => {
          return res.post_id;
        }),
      )
      .subscribe((post_id: string) => {
        const index = this.posts().findIndex((p) => p.post_id == post_id);
        this._httpClient.get<PostType>(environment.apiUrl + 'posts/' + post_id).subscribe((newPost) => {
          this.posts.update((posts) => {
            posts[index] = newPost;
            return posts;
          });
        });
      });
  }

  onCommentInput(event: Event) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const comment = target.elements.namedItem('comment') as HTMLInputElement;
    if (comment.value) {
      const content = comment.value;
      this.commentPost(target.id, content);
    } else {
      return;
    }
  }
}
