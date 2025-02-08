import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  pregnancyGetRes,
  pregnancyUpdateFailRes,
  pregnancyUpdateSuccessRes,
} from '../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyTrackingApiService } from '../pregnancy-tracking.api.service';
import { PregnancyTrackingSignalService } from '../pregnancy-tracking.signal.service';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { FileUploadComponent } from './pregnancy-tracking-file-upload/file-upload.component';

@Component({
  selector: 'app-pregnancy-tracking-form',
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
  templateUrl: './pregnancy-tracking-form.component.html',
  styleUrl: './pregnancy-tracking-form.component.css',
})
export class PregnancyTrackingFormComponent implements OnInit {
  signalService: PregnancyTrackingSignalService = inject(PregnancyTrackingSignalService);
  apiService: PregnancyTrackingApiService = inject(PregnancyTrackingApiService);
  @Input() data: pregnancyGetRes;
  protected imgSrcListSignal = this.signalService.MediaSrc;
  protected pregnancyForm: FormGroup;
  protected formControls = signal<
    {
      controlLabel: string;
      controlName: string;
      controlType: 'Number' | 'Select' | 'Date';
      selectItems?: any[];
    }[]
  >([]);

  ngOnInit() {
    this.initForm();
    if (this.data) {
      this.setFormByData(this.data);
    }
    console.log(this.pregnancyForm.value);
  }

  initForm() {
    this.pregnancyForm = new FormGroup({});
    this.addControlToForm('visitDoctorDate', new Date(), 'Date', 'Ngày đi khám bác sĩ');
    this.addControlToForm('nextVisitDate', new Date(), 'Date', 'Ngày đi khám tiếp theo');
    this.addControlToForm('expectedBirthDate', new Date(), 'Date', 'Ngày dự sinh');
    this.apiService.getHospitalList().subscribe((hospitals) => {
      this.addControlToForm('hospital', '', 'Select', 'Bệnh viện', hospitals);
    });
    this.addControlToForm('week', 0, 'Number', 'Tuần thai');
    this.apiService.getMetrics().subscribe((metrics) => {
      metrics.forEach((metric) => {
        this.addControlToForm(metric.id, 0, 'Number', metric.title);
      });
    });
  }

  addControlToForm(controlName: string, controlValue: any, controlType: 'Number' | 'Select' | 'Date', controlLabel: string, selectItems?: any[]) {
    switch (controlType) {
      case 'Number':
        this.pregnancyForm.addControl(controlName, new FormControl(controlValue || 0));
        break;
      case 'Select':
        this.pregnancyForm.addControl(controlName, new FormControl(controlValue || ''));
        break;
      case 'Date':
        this.pregnancyForm.addControl(controlName, new FormControl(controlValue || new Date()));
        break;
    }
    this.formControls().push({ controlLabel, controlName, controlType, selectItems });
  }

  setFormByData(pregnancyData: pregnancyGetRes) {
    this.formControls().forEach((control) => {
      if (Object.getOwnPropertyNames(pregnancyData).includes(control.controlName)) {
        if (control.controlType != 'Select') {
          this.pregnancyForm.get(control.controlName).setValue(pregnancyData[control.controlName]);
        } else {
          this.pregnancyForm.get(control.controlName).setValue(pregnancyData[control.controlName].id);
        }
      }
      if (pregnancyData.data.find((d) => d.metric_id === control.controlName)) {
        this.pregnancyForm.get(control.controlName).setValue(pregnancyData.data.find((d) => d.metric_id === control.controlName).value);
      }
    });
  }

  submitForm() {
    this.signalService.submit(this.pregnancyForm.value).subscribe({
      next: (res: pregnancyUpdateSuccessRes) => {
        console.log(res.data);
        console.log('success');
      },
      error: (err: pregnancyUpdateFailRes) => {
        console.log(err);
      },
    });
  }
}
