import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule } from '@jsverse/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxSplideModule } from 'ngx-splide';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { FuseCardComponent } from '../../../@fuse/components/card';

@Component({
  selector: 'app-calculate-due-date',
  imports: [
    FuseCardComponent,
    MatIconButton,
    MatLabel,
    NgClass,
    TranslocoModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatMenuModule,
    MatTabsModule,
    MatButtonToggleModule,
    NgApexchartsModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TextFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    TooltipModule,
    ButtonModule,
    NgxSplideModule,
  ],
  templateUrl: './calculate-due-date.component.html',
  styleUrl: './calculate-due-date.component.css',
})
export class CalculateDueDateComponent {
  private _expectedDate: Date = new Date();
  public formatDate: string;

  // Form tính ngày dự sinh
  countDownForm = new FormGroup({
    lastMenstrualPeriod: new FormControl('', Validators.required),
    menstrualCycle: new FormControl('', Validators.required),
  });

  calculateExpectedDate() {
    const lastMenstrualPeriodString: string | null = this.countDownForm.get('lastMenstrualPeriod')!.value;
    const lastMenstrualPeriod: Date | null = lastMenstrualPeriodString ? new Date(lastMenstrualPeriodString) : null;
    const menstrualCycleString: string | null = this.countDownForm.get('menstrualCycle')!.value;
    const menstrualCycle: number | null = menstrualCycleString ? Number(menstrualCycleString) : null;

    if (lastMenstrualPeriod instanceof Date && typeof menstrualCycle === 'number') {
      // Ngày dự sinh tiêu chuẩn với chu kỳ 28 ngày (40 tuần = 280 ngày)
      let dueDate = new Date(lastMenstrualPeriod);
      dueDate.setDate(dueDate.getDate() + 280);

      // Điều chỉnh theo độ dài chu kỳ kinh nguyệt
      let adjustment = menstrualCycle - 28;
      dueDate.setDate(dueDate.getDate() + adjustment);

      this._expectedDate = dueDate;
      this.formatDate = this._expectedDate.toLocaleDateString('vi-VN');
    }
  }
}
