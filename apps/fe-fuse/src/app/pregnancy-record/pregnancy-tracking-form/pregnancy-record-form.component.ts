import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { pregnancyDatatype } from '../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { PregnancyRecordApiService } from '../pregnancy-record.api.service';
import { PregnancyRecordSignalService } from '../pregnancy-record.signal.service';
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
  templateUrl: './pregnancy-record-form.component.html',
  styleUrl: './pregnancy-record-form.component.css',
})
export class PregnancyRecordFormComponent implements OnInit {
  signalService: PregnancyRecordSignalService = inject(PregnancyRecordSignalService);
  apiService: PregnancyRecordApiService = inject(PregnancyRecordApiService);
  @Input() data: pregnancyDatatype;
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

  submitForm() {
    this.signalService.submit(this.pregnancyForm.value);
  }
}
