import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MediaRes } from '@pregnancy-journal-monorepo/contract';
import { pregnancyGetRes } from '../../../../mock-api/pages/pregnancy/pregnancy.mock-api';
import { FileUploadComponent } from '../../common/file-upload/file-upload.component';
import { addControlToForm, formControls } from '../../common/form/formUtils';
import { ImagePreviewComponent } from '../../common/image-preview/image-preview.component';
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
  protected formControls = signal<formControls>([]);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.pregnancyForm = new FormGroup({});
    // this.addControlToForm('visit_doctor_date', new Date(), 'Date', 'Ngày đi khám bác sĩ', this.pregnancyForm);
    addControlToForm({
      controlName: 'visit_doctor_date',
      controlValue: new Date(),
      controlType: 'Date',
      controlLabel: 'Ngày đi khám bác sĩ',
      formGroup: this.pregnancyForm,
      formControls: this.formControls,
    });
    // this.addControlToForm('next_visit_doctor_date', new Date(), 'Date', 'Ngày đi khám tiếp theo', this.pregnancyForm);
    addControlToForm({
      controlName: 'next_visit_doctor_date',
      controlValue: new Date(),
      controlType: 'Date',
      controlLabel: 'Ngày đi khám tiếp theo',
      formGroup: this.pregnancyForm,
      formControls: this.formControls,
    });
    this.apiService.getHospitalList().subscribe((hospitals) => {
      // this.addControlToForm('hospital', '', 'Select', 'Bệnh viện', hospitals, this.pregnancyForm);
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
        // this.addControlToForm(metric.id, 0, 'Number', metric.title, undefined, this.pregnancyForm);
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
    this.signalService.submit(this.pregnancyForm.value);
  }

  deleteImg(id: string) {
    this.signalService.deleteImage(id);
  }

  insertImg(img: MediaRes) {
    this.signalService.addImage(img);
  }
}
