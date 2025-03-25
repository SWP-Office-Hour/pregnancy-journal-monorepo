import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ChildType } from '@pregnancy-journal-monorepo/contract';
import { NgAutoAnimateDirective } from 'ng-auto-animate';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ChildV2Service } from '../../../core/children/child.v2.service';
import { TrackingFormComponent } from './form/tracking-form.component';
import { PregnancyTrackingService } from './pregnancy-tracking.service';
import { RecordChartComponent } from './record-chart/record-chart.component';
import { RecordTableComponent } from './record-table/record-table.component';
import { TrackingMiniCalendarComponent } from './tracking-mini-calendendar/tracking-mini-calendar.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [RecordTableComponent, FormsModule, Toast, TrackingMiniCalendarComponent, RecordChartComponent, NgAutoAnimateDirective],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
  providers: [MessageService],
})
export class PregnancyTrackingComponent implements OnInit {
  child: ChildType;
  private _dialog: MatDialog;
  constructor(
    private childService: ChildV2Service,
    private _recordService: PregnancyTrackingService,
  ) {}

  ngOnInit() {
    // Lấy thông tin child, ví dụ:
    this.childService.child$.subscribe((data) => {
      this.child = data;
    });
  }

  getNewestRecord() {
    return this._recordService.getNewestRecord();
  }

  createRecord() {
    this._recordService.SelectedRecordData = '';
    const dialogRef = this._dialog.open(TrackingFormComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._recordService.RecordData$.subscribe();
        this._recordService.closeForm();
      }
    });
  }
}
