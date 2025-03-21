import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import {
  HospitalResponse,
  MediaResponse,
  MetricResponseType,
  RecordCreateRequest,
  RecordResponse,
  RecordUpdateRequest,
  RecordWithWarningResponse,
  Status,
} from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { map } from 'rxjs';
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
    CdkCopyToClipboard,
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
  private report_messages = signal<string[]>([]);

  constructor(
    protected dialogRef: MatDialogRef<TrackingFormComponent>,
    private _trackingService: PregnancyTrackingService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.selectedRecordData = this._trackingService.SelectedRecordData;
    this.images = this._trackingService.Media;
    this.week = this.selectedRecordData?.week;
    this.trackingForm = this._formBuilder.group({
      visit_record_id: [''],
      visit_doctor_date: [DateTime.fromJSDate(new Date()), Validators.required],
      next_visit_doctor_date: [DateTime.fromJSDate(new Date()), Validators.required],
      hospital: ['', Validators.required],
      doctor_name: ['', Validators.required],
      metrics: this._formBuilder.array([]),
    });
    this._trackingService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
    if (this._trackingService.SelectedRecordData) {
      this.patchValue(this.selectedRecordData);
    } else {
      this._trackingService.getMetrics().subscribe((metrics) => {
        this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
        this.metrics.forEach((metric) => {
          this.metricsFormArray.push(this._formBuilder.control('0', metric.required ? Validators.required : []));
        });
      });
    }
  }

  get metricsFormArray() {
    return this.trackingForm.get('metrics') as FormArray;
  }

  get messages() {
    return this.report_messages;
  }

  submitForm() {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      this.submitFail();
      return;
    }
    const data = this.metricsFormArray.controls.map((control, index) => ({
      metric_id: this.metrics[index].metric_id,
      value: control.value,
    }));
    const { visit_doctor_date, next_visit_doctor_date, doctor_name, hospital, visit_record_id } = this.trackingForm.value;
    const formData = {
      hospital_id: hospital,
      doctor_name,
      visit_doctor_date: visit_doctor_date.toJSDate(),
      next_visit_doctor_date: next_visit_doctor_date.toJSDate(),
      data,
    };
    if (this._trackingService.SelectedRecordData) {
      this.updateRecord({ ...formData, visit_record_id });
    } else {
      this.createRecord(formData);
    }
  }

  createRecord(formData: RecordCreateRequest) {
    console.log(formData);
    this._trackingService.createRecord(formData).subscribe({
      next: (res: RecordWithWarningResponse) => {
        this._trackingService.createImage(res.visit_record_id).subscribe(() => {
          this.trackingForm.disable();
          this.submitSuccess();
          this.messages.set(res.warnings);
        });
      },
      error: (err) => {
        console.log(err);
        this.submitFail();
      },
    });
  }

  updateRecord(formData: RecordUpdateRequest) {
    this._trackingService.updateRecord(formData).subscribe({
      next: (res: RecordResponse) => {
        this._trackingService.updateImage(res.visit_record_id).subscribe((res) => {
          this.submitSuccess();
          this._trackingService.closeForm();
          this.dialogRef.close();
        });
      },
      error: (err) => {
        console.log(err);
        this.submitFail();
        this._trackingService.closeForm();
        this.dialogRef.close();
      },
    });
  }

  deleteImg(id: string) {
    this.images = this._trackingService.deleteImage(id);
  }

  insertImg(img: MediaResponse) {
    this._trackingService.addImage(img);
  }

  submitSuccess(
    { summary, detail }: { summary?: string; detail?: string } = {
      summary: 'Lưu thành công',
      detail: 'Lưu chỉ số thành công',
    },
  ) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      key: 'tr',
      life: 3000,
    });
  }

  submitFail() {
    this.messageService.add({
      severity: 'error',
      summary: 'Lưu thất bại',
      detail: 'Lưu chỉ số thất bại',
      key: 'tr',
      life: 3000,
    });
  }

  visitDateChange(e: MatDatepickerInputEvent<any>) {
    this.trackingForm.get('visit_doctor_date')!.setValue((e.value as DateTime).setLocale('vi-VN').plus({ hour: 7 }));
  }

  nextVisitDateChange(e: MatDatepickerInputEvent<any>) {
    this.trackingForm.get('next_visit_doctor_date')!.setValue((e.value as DateTime).setLocale('vi-VN').plus({ hour: 7 }));
  }

  sharedRecord() {
    return window.location.href.split('/').slice(0, 3).join('/') + '/record-view?record_id=' + this.selectedRecordData.visit_record_id;
  }

  copyToClipboard() {
    this.submitSuccess({
      summary: 'Sao chép thành công',
      detail: 'Đã sao chép link chia sẻ',
    });
  }

  patchValue(value: RecordResponse) {
    this.trackingForm.patchValue({
      visit_record_id: value.visit_record_id,
      hospital: value.hospital.hospital_id,
      doctor_name: value.doctor_name,
      visit_doctor_date: DateTime.fromJSDate(new Date(value.visit_doctor_date)),
      next_visit_doctor_date: DateTime.fromJSDate(new Date(value.next_visit_doctor_date)),
    });
    this._trackingService
      .getMetrics()
      .pipe(
        map((metrics) => {
          this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
          this.metrics.forEach((metric) => {
            const filteredValue = value.data.find((data) => data.metric_id === metric.metric_id)?.value || 0;
            this.metricsFormArray.push(this._formBuilder.control(filteredValue, metric.required ? Validators.required : []));
          });
        }),
      )
      .subscribe(() => {
        value.data.forEach((data) => {
          // Compare data value with standard value
          const metric: MetricResponseType = this.metrics?.find((metric) => metric.metric_id === data.metric_id);
          if (metric) {
            this._trackingService
              .getStandardValue({
                metric_id: metric.metric_id,
                week: value.week,
              })
              .subscribe((standard) => {
                if (!standard) return;
                const [value, value_extended] = data.value.split('/');
                if (value == '0' || value == '0/0' || value == '' || value == ' ') return;
                if (value_extended) {
                  const report_msg =
                    Number(value_extended) > standard.upperbound
                      ? metric.upperbound_msg
                      : Number(value) < standard.lowerbound
                        ? metric.lowerbound_msg
                        : '';
                  console.log(report_msg);
                  this.report_messages.set([...this.report_messages(), report_msg]);
                } else {
                  const report_msg =
                    Number(value) > standard.upperbound ? metric.upperbound_msg : Number(value) < standard.lowerbound ? metric.lowerbound_msg : '';
                  console.log(report_msg);
                  this.report_messages.set([...this.report_messages(), report_msg]);
                }
              });
          }
        });
      });
  }

  closeForm() {
    this._trackingService.closeForm();
    this.dialogRef.close();
  }
}
