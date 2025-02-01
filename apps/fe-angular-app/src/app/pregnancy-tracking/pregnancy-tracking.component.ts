import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TuiInputDateModule, TuiInputModule, TuiInputTimeModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiDay } from '@taiga-ui/cdk';
import { PregnancyTrackingFormComponent } from '../../pregnancy-tracking-form/pregnancy-tracking-form.component';

@Component({
  selector: 'app-pregnancy-tracking',
  imports: [
    ReactiveFormsModule,
    TuiInputDateModule,
    TuiInputModule,
    TuiInputTimeModule,
    TuiSelectModule,
    PregnancyTrackingFormComponent,
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
