import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HospitalResponse, MediaResponse, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadComponent } from '../../../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../../../common/image-preview/image-preview.component';
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
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './tracking-form.component.html',
  styleUrl: './tracking-form.component.css',
})
export class TrackingFormComponent {
  protected trackingForm: FormGroup;
  protected images: MediaResponse[];
  protected hospitals: HospitalResponse[];
  protected metrics: MetricResponseType[];
  protected selectedRecordData: RecordResponse;
  protected week: number;

  constructor(
    protected dialogRef: MatDialogRef<TrackingFormComponent>,
    private _trackingService: PregnancyTrackingService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.selectedRecordData = this._trackingService.SelectedRecordData;
    this.images = this._trackingService.Media;
    this.week = this.selectedRecordData.week;
    this.trackingForm = this._formBuilder.group({
      visit_record_id: ['', Validators.required],
      visit_doctor_date: [new Date(), Validators.required],
      next_visit_doctor_date: [new Date(), Validators.required],
      hospital: ['', Validators.required],
      doctor_name: ['', Validators.required],
      metrics: this._formBuilder.array([]),
    });
    this.trackingForm.patchValue({
      visit_record_id: this.selectedRecordData.visit_record_id,
      hospital: this.selectedRecordData.hospital.hospital_id,
      doctor_name: this.selectedRecordData.doctor_name,
      visit_doctor_date: this.selectedRecordData.visit_doctor_date,
      next_visit_doctor_date: this.selectedRecordData.next_visit_doctor_date,
    });
    this._trackingService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
    this._trackingService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
      this.metrics.forEach((metric) => {
        const value = this.selectedRecordData.data.find((data) => data.metric_id === metric.metric_id)?.value || 0;
        this.metricsFormArray.push(this._formBuilder.control(value, metric.required ? Validators.required : []));
      });
    });
  }

  get metricsFormArray() {
    return this.trackingForm.get('metrics') as FormArray;
  }

  submitForm() {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      this.submitFail();
      return;
    }
    const data = this.metricsFormArray.controls.map((control, index) => ({
      metric_id: this.metrics[index].metric_id,
      value: control.value as number,
    }));
    const { visit_doctor_date, next_visit_doctor_date, doctor_name, hospital, visit_record_id } = this.trackingForm.value;
    const formData = {
      visit_record_id,
      hospital_id: hospital,
      doctor_name,
      visit_doctor_date: new Date(visit_doctor_date).toISOString(),
      next_visit_doctor_date: new Date(next_visit_doctor_date).toISOString(),
      data,
    };
    console.log(formData);
    this._trackingService.submit(formData).subscribe({
      next: (res) => {
        this._trackingService.updateImage(res.visit_record_id).subscribe((res) => {
          console.log(res);
          this.submitSuccess();
        });
      },
      error: (err) => {
        console.log(err);
        this.submitFail();
      },
    });
  }

  deleteImg(id: string) {
    this.images = this._trackingService.deleteImage(id);
  }

  insertImg(img: MediaResponse) {
    this._trackingService.addImage(img);
  }

  closeForm() {
    this._trackingService.SelectedRecordData = '';
    this.dialogRef.close();
  }

  submitSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Lưu thành công', detail: 'Lưu chỉ số thành công', key: 'tr', life: 3000 });
  }

  submitFail() {
    this.messageService.add({ severity: 'error', summary: 'Lưu thất bại', detail: 'Lưu chỉ số thất bại', key: 'tr', life: 3000 });
  }
}
