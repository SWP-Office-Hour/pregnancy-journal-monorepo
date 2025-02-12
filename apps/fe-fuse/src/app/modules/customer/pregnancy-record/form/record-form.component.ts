import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { pregnancyGetRes } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { PregnancyRecordApiService } from '../service/pregnancy-record.api.service';
import { PregnancyRecordSignalService } from '../service/pregnancy-record.signal.service';

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
export class RecordFormComponent implements OnInit {
  signalService: PregnancyRecordSignalService = inject(PregnancyRecordSignalService);
  apiService: PregnancyRecordApiService = inject(PregnancyRecordApiService);
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
  }

  initForm() {
    this.pregnancyForm = new FormGroup({});
    this.addControlToForm('visit_doctor_date', new Date(), 'Date', 'Ngày đi khám bác sĩ');
    this.addControlToForm('next_visit_doctor_date', new Date(), 'Date', 'Ngày đi khám tiếp theo');
    this.apiService.getHospitalList().subscribe((hospitals) => {
      this.addControlToForm('hospital', '', 'Select', 'Bệnh viện', hospitals);
    });
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

  submitForm() {
    this.signalService.submit(this.pregnancyForm.value);
  }
}
