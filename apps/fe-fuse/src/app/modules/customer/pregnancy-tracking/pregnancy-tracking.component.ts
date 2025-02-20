import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { PregnancyTrackingService } from './pregnancy-tracking.service';
import { TrackingCardComponent } from './tracking-card/tracking-card.component';

@Component({
  selector: 'app-pregnancy-service',
  imports: [TrackingCardComponent, RouterLink, MatAnchor, MatIcon],
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
      console.log(this.recordsData);
    });
  }

  backClicked() {
    this._location.back();
  }
}
