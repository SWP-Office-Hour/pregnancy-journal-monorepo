import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PregnancyTrackingService } from '../services/pregnancy-tracking.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiError } from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiInputDateModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-pregnancy-tracking-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiInputDateModule,
  ],
  templateUrl: './pregnancy-tracking-form.component.html',
  styleUrl: './pregnancy-tracking-form.component.css',
})
export class PregnancyTrackingFormComponent {
  pregnancyService: PregnancyTrackingService = inject(PregnancyTrackingService);
  metrics = this.pregnancyService.getMetricsForUsers();
  protected persons = ['Option 1', 'Option 2'];
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
      'visitDate',
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
  }

  formControls() {
    return new Array(this.pregnancyForm.controls);
  }

  submitForm() {
    //
  }
}
