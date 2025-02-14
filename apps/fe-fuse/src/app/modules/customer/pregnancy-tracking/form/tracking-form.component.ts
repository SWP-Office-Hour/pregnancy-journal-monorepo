import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HospitalResponse, MediaResponse, MetricResponse, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { FileUploadComponent } from '../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../common/image-preview/image-preview.component';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'tracking-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  templateUrl: './tracking-form.component.html',
  styleUrl: './tracking-form.component.css',
})
export class TrackingFormComponent {
  protected trackingForm: FormGroup;
  protected images: MediaResponse[];
  protected hospitals: HospitalResponse[];
  protected metrics: MetricResponse[];
  protected selectedRecordData: RecordResponse;
  protected week: number;

  constructor(
    private _trackingService: PregnancyTrackingService,
    private _formBuilder: FormBuilder,
  ) {
    this.selectedRecordData = this._trackingService.SelectedRecordData;
    this.images = this._trackingService.Media;
    this.week = this.selectedRecordData.week;
    this.trackingForm = this._formBuilder.group(
      {
        visit_doctor_date: new Date(),
        next_visit_doctor_date: new Date(),
        hospital: '',
        doctor_name: '',
        metrics: this._formBuilder.array([]),
      },
      {
        validators: [Validators.required],
      },
    );
    this.trackingForm.patchValue({
      hospital: this.selectedRecordData.hospital.id,
      doctor_name: this.selectedRecordData.doctor_name,
      visit_doctor_date: this.selectedRecordData.visit_doctor_date,
      next_visit_doctor_date: this.selectedRecordData.next_visit_doctor_date,
    });
    this._trackingService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
    this._trackingService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics;
      this.metrics.forEach((metric) => {
        const value = this.selectedRecordData.data.find((data) => data.metric_id === metric.id)?.value || 0;
        this.metricsFormArray.push(this._formBuilder.control(value));
      });
    });
  }

  get metricsFormArray() {
    return this.trackingForm.get('metrics') as FormArray;
  }

  submitForm() {
    const data = this.metricsFormArray.controls.map((control, index) => ({
      metric_id: this.metrics[index].id,
      value: control.value as number,
    }));
    const { visit_doctor_date, next_visit_doctor_date, doctor_name, hospital } = this.trackingForm.value;
    const formData = {
      hospital_id: hospital,
      doctor_name,
      visit_doctor_date: new Date(visit_doctor_date).toISOString(),
      next_visit_doctor_date: new Date(next_visit_doctor_date).toISOString(),
      data,
    };
    this._trackingService.submit(formData);
  }

  deleteImg(id: string) {
    this._trackingService.deleteImage(id);
  }

  insertImg(img: MediaResponse) {
    this._trackingService.addImage(img);
  }
}
