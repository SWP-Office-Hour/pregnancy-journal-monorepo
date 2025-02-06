import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';
import { FileUploadComponent } from '../pregnancy-tracking-file-upload/file-upload.component';
import { pregnancyDatatype } from '../pregnancy-tracking.mock-api';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking-form',
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
  pregnancyService: PregnancyTrackingService = inject(PregnancyTrackingService);
  @Input() pregnancyTrackingData!: WritableSignal<pregnancyDatatype>;

  protected imgSrcListSignal = this.pregnancyService.MediaSrc;
  protected metrics = this.pregnancyService.getMetrics();

  protected pregnancyForm: FormGroup;
  protected formControls = signal<
    {
      controlLabel: string;
      controlName: string;
      controlType: 'Number' | 'Select' | 'Date';
      selectItems?: any[];
    }[]
  >([]);
  //
  protected hospitals = this.pregnancyService.getHospitalList();
  protected pregnancyData = this.pregnancyService.recordSelected;

  ngOnInit() {
    this.initForm();
    this.setValueByPregnancyData();
  }

  initForm() {
    this.pregnancyForm = new FormGroup({});
    this.addControlToForm('visitDoctorDate', new Date(), 'Date', 'Ngày đi khám bác sĩ');
    this.addControlToForm('nextVisitDate', new Date(), 'Date', 'Ngày đi khám tiếp theo');
    this.addControlToForm('expectedBirthDate', new Date(), 'Date', 'Ngày dự sinh');
    this.hospitals.subscribe((hospitals) => {
      this.addControlToForm('hospital', '', 'Select', 'Bệnh viện', hospitals);
    });
    this.addControlToForm('week', 0, 'Number', 'Tuần thai');
    this.metrics.subscribe((metrics) => {
      metrics.forEach((metric) => {
        this.addControlToForm(metric.id, 0, 'Number', metric.title);
      });
    });
  }

  addControlToForm(
    controlName: string,
    controlValue: any,
    controlType: 'Number' | 'Select' | 'Date',
    controlLabel: string,
    selectItems?: any[],
  ) {
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

  setValueByPregnancyData() {
    this.formControls().forEach((control) => {
      if (Object.getOwnPropertyNames(this.pregnancyData()).includes(control.controlName)) {
        if (control.controlType === 'Select') {
          this.pregnancyForm.get(control.controlName).setValue(this.pregnancyData()[control.controlName].id);
        } else {
          this.pregnancyForm.get(control.controlName).setValue(this.pregnancyData()[control.controlName]);
        }
      }
      if (this.pregnancyData().data.some((metric) => metric.metric_id == control.controlName)) {
        this.pregnancyForm
          .get(control.controlName)
          .setValue(this.pregnancyData().data.find((metric) => metric.metric_id == control.controlName).value);
      }
    });
  }
}
