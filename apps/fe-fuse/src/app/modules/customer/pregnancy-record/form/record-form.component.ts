import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HospitalResponse, MediaResponse, MetricResponseType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { FileUploadComponent } from '../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../common/image-preview/image-preview.component';
import { PregnancyRecordService } from '../pregnancy-record.service';

@Component({
  selector: 'record-form',
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
  templateUrl: './record-form.component.html',
  styleUrl: './record-form.component.css',
})
export class RecordFormComponent {
  @Input() data: RecordResponse;
  protected images: MediaResponse[];
  protected recordForm: FormGroup;
  protected hospitals: HospitalResponse[];
  protected metrics: MetricResponseType[];
  protected submitted = false;

  constructor(
    private _recordService: PregnancyRecordService,
    private _formBuilder: FormBuilder,
  ) {
    this.recordForm = this._formBuilder.group(
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
    this._recordService.getHospital().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
    this._recordService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics;
      this.metrics.forEach(() => {
        this.metricsFormArray.push(this._formBuilder.control(0));
      });
    });
    this.images = this._recordService.getMediaSrc();
  }

  get metricsFormArray() {
    return this.recordForm.get('metrics') as FormArray;
  }

  submitForm() {
    const data = this.metricsFormArray.controls.map((control, index) => ({
      metric_id: this.metrics[index].metric_id,
      value: control.value as number,
    }));
    const { visit_doctor_date, next_visit_doctor_date, doctor_name, hospital } = this.recordForm.value;
    const formData = {
      hospital_id: hospital,
      doctor_name,
      visit_doctor_date: new Date(visit_doctor_date).toISOString(),
      next_visit_doctor_date: new Date(next_visit_doctor_date).toISOString(),
      data,
    };
    this._recordService.submit(formData).subscribe({
      next: () => {
        window.alert('Record submitted successfully');
      },
      error: () => {
        window.alert('Failed to submit record');
      },
    });
  }

  deleteImg(id: string) {
    this._recordService.deleteImage(id);
  }

  insertImg(img: MediaResponse) {
    this._recordService.addImage(img);
  }
}
