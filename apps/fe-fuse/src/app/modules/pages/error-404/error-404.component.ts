import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoadingHeartComponent } from '../../../common/loading-heart/loading-heart.component';

@Component({
  selector: 'error-404',
  templateUrl: './error-404.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, LoadingHeartComponent],
})
export class Error404Component {
  /**
   * Constructor
   */
  constructor() {}
}
