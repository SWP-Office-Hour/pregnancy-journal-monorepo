import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiFieldErrorPipe, TuiFileLike, TuiInputNumber } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { TuiInputDateModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import { FileUploadComponent } from './pregnancy-tracking-file-upload/file-upload.component';
import { PregnancyTrackingService } from '../../services/pregnancy-tracking.service';

@Component({
  selector: 'app-pregnancy-tracking-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiInputDateModule,
    TuiInputModule,
    TuiInputNumber,
    TuiSelectModule,
    TuiLabel,
    TuiTextfield,
    TuiButton,
    TuiDataListWrapper,
    AsyncPipe,
    ReactiveFormsModule,
    FileUploadComponent
  ],
  templateUrl: './pregnancy-tracking-form.component.html',
  styleUrl: './pregnancy-tracking-form.component.css',
})
export class PregnancyTrackingFormComponent {
  pregnancyService: PregnancyTrackingService = inject(PregnancyTrackingService);
  metrics = this.pregnancyService.getMetricsForUsers();
  protected pregnancyForm = new FormGroup({});
  protected hospitals = this.pregnancyService.getHospitalList();

  constructor() {
    this.initForm();
  }

  initForm() {
    const date = new Date();
    for (const metric of this.metrics) {
      this.pregnancyForm.addControl(metric.title, new FormControl(0));
    }
    this.pregnancyForm.addControl('hospital', new FormControl(this.hospitals[0]));
    this.pregnancyForm.addControl(
      'visitDoctorDate',
      new FormControl(new TuiDay(date.getFullYear(), date.getMonth(), date.getDate())),
    );
    this.pregnancyForm.addControl(
      'nextVisitDate',
      new FormControl(new TuiDay(date.getFullYear(), date.getMonth(), date.getDate())),
    );
    this.pregnancyForm.addControl(
      'expectedBirthDate',
      new FormControl(new TuiDay(date.getFullYear(), date.getMonth(), date.getDate())),
    );
    this.pregnancyForm.addControl('week', new FormControl(32));
    this.pregnancyForm.addControl('file', new FormControl<TuiFileLike | null>(null, Validators.required));
  }

  formControls() {
    return new Array(this.pregnancyForm.controls);
  }

  submitForm() {
    //
  }
}
