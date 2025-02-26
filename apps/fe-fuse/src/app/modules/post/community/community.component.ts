import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostType } from '@pregnancy-journal-monorepo/contract';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FuseCardComponent } from '../../../../../../fuse-example/src/@fuse/components/card';
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
  protected posts: PostType[] = [];

  constructor(
    private _userService: UserService,
    private _httpClient: HttpClient,
    private dialog: MatDialog,
  ) {
    this._userService.user$.subscribe((user) => {
      this.user = user;
    });
    this._httpClient.get<PostType[]>(environment.apiUrl + 'posts').subscribe((posts) => {
      this.posts = posts;
    });
  }

  onScroll() {
    console.log('Scrolled');
  }

  openRef() {
    this.dialog.open(CreatePostComponent);
  }
}
