import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { FuseCardComponent } from '../../../../../@fuse/components/card';
import { TrackingFormComponent } from '../form/tracking-form.component';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-tracking-card',
  imports: [FuseCardComponent, MatIconModule, MatButtonModule, DatePipe],
  templateUrl: './tracking-card.component.html',
  styleUrl: './tracking-card.component.css',
})
export class TrackingCardComponent {
  @Input() recordData!: RecordResponse;

  constructor(
    private _trackingService: PregnancyTrackingService,
    private _dialog: MatDialog,
  ) {}

  editTracking() {
    this._trackingService.SelectedRecordData = this.recordData.visit_record_id;
    console.log(this._trackingService.SelectedRecordData);
    this._dialog.open(TrackingFormComponent, {
      autoFocus: false,
    });
  }
}
