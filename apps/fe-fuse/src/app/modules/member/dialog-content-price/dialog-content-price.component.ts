import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FuseCardComponent } from '../../../../@fuse/components/card';

@Component({
  selector: 'app-dialog-content-price',
  imports: [MatDialogModule, MatButtonModule, FuseCardComponent, MatIcon],
  templateUrl: './dialog-content-price.component.html',
  styleUrl: './dialog-content-price.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentPriceComponent {
  constructor(
    private scroller: ViewportScroller,
    private router: Router,
  ) {}
  // ngOnInit() {
  //   this.router.navigate(['/home']);
  // }

  // //Scroll
  // goDown1() {
  //   this.scroller.scrollToAnchor('listCard');
  // }

  goDown2() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById('header').scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
  //
  // goDown3() {
  //   this.router.navigate([], { fragment: 'targetBlue' });
  // }
}
