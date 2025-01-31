import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiError, TuiLabel, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiFieldErrorPipe, TuiInputNumber, TuiStepper } from '@taiga-ui/kit';
import { TuiForm, TuiHeader } from '@taiga-ui/layout';
import { TuiInputDateModule, TuiInputModule, TuiInputTimeModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    TuiButton,
    TuiDataListWrapper,
    TuiError,
    TuiFieldErrorPipe,
    TuiForm,
    TuiHeader,
    TuiInputDateModule,
    TuiInputModule,
    TuiInputNumber,
    TuiInputTimeModule,
    TuiLabel,
    TuiSelectModule,
    TuiStepper,
    TuiTextfield,
    TuiTitle,
  ],
  templateUrl: './pregnancy-tracking.component.html',
  styleUrl: './pregnancy-tracking.component.css',
})
export class PregnancyTrackingComponent {
  protected persons = ['Option 1', 'Option 2'];
  protected testForm = new FormGroup({
    textValue: new FormControl(''),
    numberValue: new FormControl(0),
    dateValue: new FormControl(new TuiDay(2017, 0, 15)),
    selectionValue: new FormControl(this.persons[0]),
  });

  submitForm() {
    console.log(this.testForm.value);
  }
}
