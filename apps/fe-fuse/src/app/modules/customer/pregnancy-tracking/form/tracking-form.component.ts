import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatAutocompleteModule,
    MatDivider,
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
  protected isDisabled = signal<boolean>(false);
  private report_messages = signal<string[]>([]);
  hospitalSearchControl = new FormControl('');
  selectedHospital: HospitalResponse | null = null;
  protected filteredHospitals: HospitalResponse[] = [];
  protected searchTerm: string = '';

  constructor(
    protected dialogRef: MatDialogRef<TrackingFormComponent>,
    private _trackingService: PregnancyTrackingService,
    private _formBuilder: FormBuilder,
    private messageService: MessageService,
  ) {
    this.selectedRecordData = this._trackingService.SelectedRecordData;
    this.images = this._trackingService.Media;
    this.week = this.selectedRecordData?.week;
    this.trackingForm = this._formBuilder.group({
      visit_record_id: [''],
      visit_doctor_date: [DateTime.fromJSDate(new Date()), [Validators.required, this.maxTodayValidator()]],
      next_visit_doctor_date: [DateTime.fromJSDate(new Date()), [Validators.required, this.max42WeeksValidator()]],
      hospital: ['', Validators.required],
      doctor_name: ['', Validators.required],
      metrics: this._formBuilder.array([]),
    });
    this._trackingService.getHospitals().subscribe((hospitals) => {
      this.hospitals = hospitals;
      this.filteredHospitals = hospitals; // Initialize with all hospitals
    });
    this.hospitalSearchControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.filterHospitals(value);
      }
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

  private maxTodayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as DateTime;
      if (!value) return null;

      const today = DateTime.now().startOf('day');
      return value.startOf('day') > today ? { futureDate: true } : null;
    };
  }

  private max42WeeksValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as DateTime;
      if (!value) return null;

      const maxDate = DateTime.now().plus({ weeks: 42 }).startOf('day');
      return value.startOf('day') > maxDate ? { tooFar: true } : null;
    };
  }

  // Update filter method
  filterHospitals(searchValue: string): void {
    if (!searchValue) {
      this.filteredHospitals = this.hospitals;
      return;
    }

    const search = searchValue.toLowerCase();
    this.filteredHospitals = this.hospitals.filter((hospital) => hospital.name.toLowerCase().includes(search));
  }

  // Display method for autocomplete
  displayFn(hospital: HospitalResponse): string {
    return hospital && hospital.name ? hospital.name : '';
  }

  // Method to handle hospital selection
  selectHospital(hospital: HospitalResponse): void {
    this.selectedHospital = hospital;
    this.trackingForm.get('hospital').setValue(hospital.hospital_id);
  }

  submitForm() {
    // this.isDisabled.set(true);
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      this.submitFail();
      return;
    }

    // Standardize date comparison by removing time component
    const visitDate = this.trackingForm.get('visit_doctor_date')?.value as DateTime;
    const nextVisitDate = this.trackingForm.get('next_visit_doctor_date')?.value as DateTime;
    const today = DateTime.now().startOf('day');
    const maxDate = today.plus({ weeks: 42 }).startOf('day');

    // Replace console logs with more structured debugging
    console.log({
      visitDate: visitDate.toISO(),
      today: today.toISO(),
      isVisitDateFuture: visitDate > today,
      nextVisitDate: nextVisitDate.toISO(),
      maxDate: maxDate.toISO(),
      isNextVisitTooFar: nextVisitDate > maxDate,
    });

    // Compare only dates (ignore time)
    if (visitDate.startOf('day') > today) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lưu thất bại',
        detail: 'Ngày khám không được lớn hơn ngày hôm nay',
        key: 'tr',
        life: 3000,
      });
      return;
    }

    if (nextVisitDate.startOf('day') > maxDate) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lưu thất bại',
        detail: 'Ngày khám tiếp theo không được quá 42 tuần từ hôm nay',
        key: 'tr',
        life: 3000,
      });
      return;
    }

    if (nextVisitDate.startOf('day') < visitDate.startOf('day')) {
      this.messageService.add({
        severity: 'error',
        summary: 'Lưu thất bại',
        detail: 'Ngày tái khám không được sớm hơn ngày khám',
        key: 'tr',
        life: 3000,
      });
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

  submitFail(msg?: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Lưu thất bại',
      detail: msg || 'Lưu chỉ số thất bại',
      key: 'tr',
      life: 3000,
    });
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
        this._trackingService.updateImage(res.visit_record_id).subscribe(() => {
          this.submitSuccess();
          this.dialogRef.close();
        });
      },
      error: (err) => {
        console.log(err);
        this.submitFail();
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
    if (this.hospitals) {
      this.filteredHospitals = this.hospitals;
    }
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

  deleteRecord() {
    this._trackingService.deleteRecord(this.selectedRecordData.visit_record_id).subscribe(() => {
      this.dialogRef.close();
      this.submitSuccess({
        summary: 'Xóa thành công',
        detail: 'Xóa hồ sơ thành công',
      });
    });
  }

  closeForm() {
    this._trackingService.closeForm();
    this.dialogRef.close();
  }
}
