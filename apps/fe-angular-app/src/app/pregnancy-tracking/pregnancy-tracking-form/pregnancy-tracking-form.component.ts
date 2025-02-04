import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiError, TuiLabel, TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiFieldErrorPipe, TuiFileLike, TuiInputNumber } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { TuiInputDateModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';
import { FileUploadComponent } from '../pregnancy-tracking-file-upload/file-upload.component';
import { map } from 'rxjs';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

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
    TuiSelectModule,
    TuiLabel,
    TuiTextfield,
    TuiDataListWrapper,
    AsyncPipe,
    ReactiveFormsModule,
    TuiButton,
    TuiInputNumber,
    FileUploadComponent,
    ImagePreviewComponent,
  ],
  templateUrl: './pregnancy-tracking-form.component.html',
  styleUrl: './pregnancy-tracking-form.component.css',
})
export class PregnancyTrackingFormComponent {
  pregnancyService: PregnancyTrackingService = inject(PregnancyTrackingService);
  protected imgSrcListSignal = signal<string[]>([]);
  protected filesSignal = signal<TuiFileLike[]>([]);
  protected metrics = this.pregnancyService.getMetrics();
  protected pregnancyForm = new FormGroup({});
  protected hospitals = this.pregnancyService.getHospitalList();
  protected hospitalNames = this.hospitals.pipe(map((hospitals) => hospitals.map(({ name }) => name)));

  constructor() {
    this.initForm();
  }

  initForm() {
    const date = new Date();
    this.metrics.subscribe((metrics) => {
      for (const metric of metrics) {
        this.pregnancyForm.addControl(metric.id, new FormControl(0));
      }
    });
    this.hospitals.subscribe((hospitals) => {
      this.pregnancyForm.addControl('hospital', new FormControl(hospitals[0].name));
    });
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

  uploadFiles(file: TuiFileLike[]) {
    this.filesSignal.set(file);
  }

  uploadFilesSrc(file: string[]) {
    this.imgSrcListSignal.set(file);
  }
}
