import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { TrackingFormComponent } from './form/tracking-form.component';
import { PregnancyTrackingService } from './pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-service',
  imports: [TrackingFormComponent, RouterLink],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
  standalone: true,
})
export class PregnancyTrackingComponent {
  protected recordsData: RecordResponse[];
  protected selectedRecordData: RecordResponse;

  constructor(
    private _trackingService: PregnancyTrackingService,
    private _location: Location,
  ) {
    this._trackingService.RecordData.subscribe((data) => {
      this.recordsData = data;
      this.selectedRecordData = this._trackingService.SelectedRecordData;
      console.log(this.recordsData);
    });
  }

  backClicked() {
    this._location.back();
  }
}
