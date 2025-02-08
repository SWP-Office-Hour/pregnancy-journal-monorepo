import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostListener, inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAlertService, TuiButton, TuiFallbackSrcPipe, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiBadgedContent, TuiBadgeNotification, TuiTabs } from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';

@Injectable({ providedIn: 'root' })
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TuiTabs,
    NgOptimizedImage,
    TuiSearch,
    TuiButton,
    TuiTextfield,
    FormsModule,
    ReactiveFormsModule,
    TuiBadgedContent,
    TuiBadgeNotification,
    AsyncPipe,
    TuiAvatar,
    TuiFallbackSrcPipe,
    TuiIcon,
    TuiBadge,
  ],
  selector: 'app-header',
  styleUrl: './header.component.less',
  templateUrl: './header.component.html',
})
export class HeaderComponentComponent {
  protected readonly NgOptimizedImage = NgOptimizedImage;

  //Nav
  private readonly alerts = inject(TuiAlertService);

  protected activeItemIndex = 0;

  protected onClick(item: string): void {
    this.alerts.open(item).subscribe();
  }
  //Search
  protected readonly form = new FormGroup({
    search: new FormControl(''),
  });

  search() {
    alert(this.form.value.search);
  }
  //test scroll
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Kiểm tra scroll position
    this.isScrolled = window.scrollY > 50;
  }
}
