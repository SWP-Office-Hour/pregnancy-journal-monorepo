import { NgForOf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxSplideModule } from 'ngx-splide';
import { StyleClass } from 'primeng/styleclass';
import { PregnancyWeekInfoComponent } from '../../modules/member/pregnancy-week-info/pregnancy-week-info.component';

@Component({
  selector: 'app-week-illustration',
  imports: [PregnancyWeekInfoComponent, NgForOf, NgxSplideModule, StyleClass],
  templateUrl: './week-illustration.component.html',
  styleUrl: './week-illustration.component.css',
})
export class WeekIllustrationComponent {
  private _currentPregnancyWeek: number = 4;
  @Input() countWeek: number = this._currentPregnancyWeek;
  public get countWeekString(): string {
    return this.countWeek.toString().padStart(4, '0');
  }

  public get countWeekNumber(): number {
    return this.countWeek;
  }

  goToThisWeek() {
    this.countWeek = this._currentPregnancyWeek;
  }
}
