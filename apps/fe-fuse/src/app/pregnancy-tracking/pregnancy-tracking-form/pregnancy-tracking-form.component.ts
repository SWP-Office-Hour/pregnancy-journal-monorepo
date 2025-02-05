import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { FileUploadComponent } from '../pregnancy-tracking-file-upload/file-upload.component';
import { pregnancyDatatype } from '../pregnancy-tracking.mock-api';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    ReactiveFormsModule,
    FileUploadComponent,
    ImagePreviewComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './pregnancy-tracking-form.component.html',
  styleUrl: './pregnancy-tracking-form.component.css',
})
export class PregnancyTrackingFormComponent implements OnInit {
  pregnancyService: PregnancyTrackingService = inject(PregnancyTrackingService);
  @Input() pregnancyTrackingData!: WritableSignal<pregnancyDatatype>;
  protected imgSrcListSignal = this.pregnancyService.MediaSrc;
  protected metrics = this.pregnancyService.getMetrics();

  protected pregnancyForm = new FormGroup({
    visitDoctorDate: new FormControl(new Date()),
    nextVisitDate: new FormControl(new Date()),
    expectedBirthDate: new FormControl(new Date()),
    hospital: new FormControl(''),
    week: new FormControl(0),
    height: new FormControl(0),
    weight: new FormControl(0),
  });
  protected hospitals = this.pregnancyService.getHospitalList();
  protected pregnancyData = this.pregnancyService.recordSelected;

  ngOnInit() {
    console.log(this.pregnancyData());
  }
}
