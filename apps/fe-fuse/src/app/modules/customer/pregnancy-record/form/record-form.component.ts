import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { HospitalResponse, MediaResponse, MetricResponseType, Status } from '@pregnancy-journal-monorepo/contract';
import { DateTime } from 'luxon';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadComponent } from '../../../../common/file-upload/file-upload.component';
import { ImagePreviewComponent } from '../../../../common/image-preview/image-preview.component';
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
  // @Input() data: RecordResponse;
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
      visit_doctor_date: ['', [Validators.required, this.maxTodayValidator()]],
      next_visit_doctor_date: ['', [Validators.required, this.max42WeeksValidator()]],
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
        this.metricsFormArray.push(this._formBuilder.control('', metric.required ? Validators.required : []));
      });
    });
    this.images = this._recordService.getMediaSrc();
  }

  get metricsFormArray() {
    return this.recordForm.get('metrics') as FormArray;
  }

  submitForm() {
    console.log('submit');
    if (this.recordForm.invalid) {
      this.recordForm.markAllAsTouched();
      this.submitFail();
      return;
    }

    // Validate metric values
    let hasInvalidValue = false;
    const data = this.metricsFormArray.controls.map((control, index) => {
      const value = control.value;
      // Skip validation for empty non-required fields
      if (value === '' && !this.metrics[index].required) {
        return {
          metric_id: this.metrics[index].metric_id,
          value: null,
        };
      }

      // Check if value is a valid number and >= 0
      const numberValue = Number(value);
      const isValid = !isNaN(numberValue) && numberValue >= 0;

      if (!isValid && value !== '') {
        hasInvalidValue = true;
      }
      console.log(this.recordForm.value);

      return {
        metric_id: this.metrics[index].metric_id,
        value: isValid ? value : null,
      };
    });

    if (hasInvalidValue) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lưu thất bại',
        detail: 'Giá trị không hợp lệ. Vui lòng nhập số lớn hơn hoặc bằng 0',
        key: 'tr',
        life: 3000,
      });
      return;
    }

    const { visit_doctor_date, next_visit_doctor_date, doctor_name, hospital } = this.recordForm.value;
    const formData = {
      hospital_id: hospital,
      doctor_name,
      visit_doctor_date: visit_doctor_date.toJSDate(),
      next_visit_doctor_date: next_visit_doctor_date.toJSDate(),
      data,
    };

    this._recordService.submit(formData).subscribe({
      next: (res) => {
        if (res) this.submitSuccess();
        this.clear();
      },
      error: (err) => {
        const { error } = err;
        const { bodyResult } = error;
        const msg = bodyResult.issues[0].message;
        this.submitFail(msg);
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
    this.messageService.add({
      severity: 'success',
      summary: 'Lưu thành công',
      detail: 'Lưu chỉ số thành công',
      key: 'tr',
      life: 3000,
    });
  }

  submitFail(msg?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Lưu thất bại',
      detail: msg || 'Lưu chỉ số thất bại',
      key: 'tr',
      life: 3000,
    });
  }

  clear() {
    this.recordForm.reset();
    this._router.navigateByUrl('tracking');
  }

  visitDateChange(e: MatDatepickerInputEvent<any>) {
    this.recordForm.get('visit_doctor_date')!.setValue((e.value as DateTime).setLocale('vi-VN').plus({ hour: 7 }));
  }

  nextVisitDateChange(e: MatDatepickerInputEvent<any>) {
    this.recordForm.get('next_visit_doctor_date')!.setValue((e.value as DateTime).setLocale('vi-VN').plus({ hour: 7 }));
  }

  private maxTodayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as DateTime;
      if (!value) return null;

      const today = DateTime.now().startOf('day');
      return value > today ? { futureDate: true } : null;
    };
  }

  private max42WeeksValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as DateTime;
      if (!value) return null;

      const maxDate = DateTime.now().plus({ weeks: 42 }).startOf('day');
      return value > maxDate ? { tooFar: true } : null;
    };
  }
}
