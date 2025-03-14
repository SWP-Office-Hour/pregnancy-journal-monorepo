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
import { PostType } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
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
  protected user: User;
  @ViewChild('.search-results') postContainer: HTMLElement;

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
}
