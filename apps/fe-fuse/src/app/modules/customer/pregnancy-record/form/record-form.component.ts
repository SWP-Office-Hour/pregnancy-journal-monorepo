import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { HospitalResponse, MediaResponse, MetricResponseType, RecordResponse, Status } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
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
    ToastModule,
  ],
  providers: [MessageService],
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
    private _router: Router,
    private _recordService: PregnancyRecordService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.recordForm = this._formBuilder.group({
      visit_doctor_date: [new Date(), Validators.required],
      next_visit_doctor_date: [new Date(), Validators.required],
      hospital: ['', Validators.required],
      doctor_name: ['', Validators.required],
      metrics: this._formBuilder.array([]),
    });
    this._recordService.getHospital().subscribe((hospitals) => {
      this.hospitals = hospitals;
    });
    this._recordService.getMetrics().subscribe((metrics) => {
      this.metrics = metrics.filter((metric) => metric.status == Status.ACTIVE);
      this.metrics.forEach((metric) => {
        this.metricsFormArray.push(this._formBuilder.control(0, metric.required ? Validators.required : []));
      });
    });
    this.images = this._recordService.getMediaSrc();
  }

  get metricsFormArray() {
    return this.recordForm.get('metrics') as FormArray;
  }

  submitForm() {
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.submitFail();
      return;
    }
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
        this.submitSuccess();
      },
      error: (err) => {
        console.log(err);
        this.submitFail();
      },
    });
  }

  deleteImg(id: string) {
    this._recordService.deleteImage(id);
  }

  insertImg(img: MediaResponse) {
    this._recordService.addImage(img);
  }

  submitSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Lưu thành công', detail: 'Lưu chỉ số thành công', key: 'tr', life: 3000 });
  }

  submitFail() {
    this.messageService.add({ severity: 'error', summary: 'Lưu thất bại', detail: 'Lưu chỉ số thất bại', key: 'tr', life: 3000 });
  }

  clear() {
    this.recordForm.reset();
  }
}
