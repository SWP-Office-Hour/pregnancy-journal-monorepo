import { ChangeDetectionStrategy, Component, inject, Injectable } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { TuiAvatar, TuiBadge, TuiBadgedContent, TuiBadgeNotification, TuiChevron, TuiTabs } from '@taiga-ui/kit';
import { TuiSearch } from '@taiga-ui/layout';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiAlertService, TuiButton, TuiFallbackSrcPipe, TuiIcon, TuiTextfield } from '@taiga-ui/core';

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
  selector: 'app-header.component',
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
}
