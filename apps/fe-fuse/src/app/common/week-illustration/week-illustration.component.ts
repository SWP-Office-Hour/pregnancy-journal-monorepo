import { Component } from '@angular/core';
import { PregnancyWeekInfoComponent } from '../../modules/member/pregnancy-week-info/pregnancy-week-info.component';
import { WeekPregnancySliderComponent } from '../week-pregnancy-slider/week-pregnancy-slider.component';

@Component({
  selector: 'app-week-illustration',
  imports: [PregnancyWeekInfoComponent, WeekPregnancySliderComponent],
  templateUrl: './week-illustration.component.html',
  styleUrl: './week-illustration.component.css',
})
export class WeekIllustrationComponent {
  private _currentPregnancyWeek: number = 4;
  private _countWeek: number = this._currentPregnancyWeek;
  public get countWeek(): string {
    return this._countWeek.toString().padStart(4, '0');
  }

  public get countWeekNumber(): number {
    return this._countWeek;
  }
  padNumberToFourDigits(value: number): string {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Giá trị phải là một số nguyên không âm.');
    }
    return value.toString().padStart(4, '0');
  }

  goToPreviousWeek() {
    if (this._countWeek > 1) this._countWeek--;
  }

  goToNextWeek() {
    if (this._countWeek < 40) this._countWeek++;
  }

  goToThisWeek() {
    this._countWeek = this._currentPregnancyWeek;
  }
}
