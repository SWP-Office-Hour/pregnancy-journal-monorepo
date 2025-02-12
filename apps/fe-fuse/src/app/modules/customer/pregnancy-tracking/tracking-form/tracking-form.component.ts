import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MediaRes } from '@pregnancy-journal-monorepo/contract';
import { pregnancyGetRes, pregnancyUpdateFailRes, pregnancyUpdateSuccessRes } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { FileUploadComponent } from '../../common/file-upload/file-upload.component';
import { addControlToForm, formControls } from '../../common/form/formUtils';
import { ImagePreviewComponent } from '../../common/image-preview/image-preview.component';
import { PregnancyTrackingApiService } from '../service/pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from '../service/pregnancy-tracking.signal.service';

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
export class TrackingFormComponent implements OnInit {
  signalService: PregnancyTrackingSignalService = inject(PregnancyTrackingSignalService);
  apiService: PregnancyTrackingApiService = inject(PregnancyTrackingApiService);
  protected data = this.signalService.RecordDataById;

  protected imgSrcListSignal = this.signalService.MediaSrc;
  protected pregnancyForm: FormGroup;
  protected formControls = signal<formControls>([]);
  protected readonly console = console;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.pregnancyForm = new FormGroup({});
    addControlToForm({
      controlName: 'visit_doctor_date',
      controlValue: new Date(),
      controlType: 'Date',
      controlLabel: 'Ngày đi khám bác sĩ',
      formGroup: this.pregnancyForm,
      formControls: this.formControls,
    });
    addControlToForm({
      controlName: 'next_visit_doctor_date',
      controlValue: new Date(),
      controlType: 'Date',
      controlLabel: 'Ngày đi khám tiếp theo',
      formGroup: this.pregnancyForm,
      formControls: this.formControls,
    });
    this.apiService.getHospitalList().subscribe((hospitals) => {
      addControlToForm({
        controlName: 'hospital',
        controlValue: '',
        controlType: 'Select',
        controlLabel: 'Bệnh viện',
        selectItems: hospitals,
        formGroup: this.pregnancyForm,
        formControls: this.formControls,
      });
    });
    this.apiService.getMetrics().subscribe((metrics) => {
      metrics.forEach((metric) => {
        addControlToForm({
          controlName: metric.id,
          controlValue: 0,
          controlType: 'Number',
          controlLabel: metric.title,
          formGroup: this.pregnancyForm,
          formControls: this.formControls,
        });
      });
    });
  }

  submitForm() {
    document.querySelectorAll('.error-message').forEach((element) => element.remove());
    this.signalService.submit(this.pregnancyForm.value).subscribe({
      next: (res: pregnancyUpdateSuccessRes) => {
        const index = this.signalService.RecordData().findIndex((data) => data.id == res.data.id);
        this.signalService.selectRecord(index);
      },
      error: (err: pregnancyUpdateFailRes) => {
        err.errors.forEach((error) => {
          const form_field = document.getElementById(Object.getOwnPropertyNames(error)[0]);
          const error_message = error[Object.getOwnPropertyNames(error)[0]];
          const error_message_element = document.createElement('div');
          error_message_element.innerText = error_message;
          error_message_element.className = 'error-message text-red-500';
          form_field.appendChild(error_message_element);
          this.pregnancyForm.get(Object.getOwnPropertyNames(error)[0]).setErrors({ invalid: true });
        });
      },
    });
  }

  deleteImg(id: string) {
    this.signalService.deleteImage(id);
  }

  insertImg(img: MediaRes) {
    this.signalService.addImage(img);
  }

  protected setFormByData(pregnancyData: pregnancyGetRes) {
    this.formControls().forEach((control) => {
      if (Object.getOwnPropertyNames(pregnancyData).includes(control.controlName)) {
        if (control.controlType != 'Select') {
          this.pregnancyForm.get(control.controlName).setValue(pregnancyData[control.controlName]);
        } else {
          this.pregnancyForm.get(control.controlName).setValue(pregnancyData[control.controlName].id);
        }
      }
      if (pregnancyData.data?.find((d) => d.metric_id === control.controlName)) {
        this.pregnancyForm.get(control.controlName).setValue(pregnancyData.data.find((d) => d.metric_id === control.controlName).value);
      }
    });
  }
}
