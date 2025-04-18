import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'overview',
  templateUrl: './overview.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule],
})
export class OverviewComponent {
  /**
   * Constructor
   */
  constructor() {}
}
