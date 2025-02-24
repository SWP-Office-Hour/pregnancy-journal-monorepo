import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { DatePicker } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DateInput, FormOutput, NumberInput, SelectInput, TextInput } from './form.type';

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, CommonModule, DatePicker, SelectModule, InputTextModule, InputNumberModule, ToastModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  providers: [MessageService],
})
export class FormComponent implements OnInit {
  @Input() title: string;
  @Input() numberInput: NumberInput[];
  @Input() textInput: TextInput[];
  @Input() selectInput: SelectInput[];
  @Input() dateInput: DateInput[];
  @Input() submitText: string;
  @Input() successToast: ToastMessageOptions;
  @Input() errorToast: ToastMessageOptions;
  @Input() warningToast: ToastMessageOptions;
  @Output() submit = new EventEmitter<FormOutput>();
  protected form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      textInputArray: this.fb.array([]),
      numberInputArray: this.fb.array([]),
      selectInputArray: this.fb.array([]),
      dateInputArray: this.fb.array([]),
    });
  }

  get textInputForm() {
    return this.form.get('textInputArray') as FormArray;
  }

  get numberInputForm() {
    return this.form.get('numberInputArray') as FormArray;
  }

  get selectInputForm() {
    return this.form.get('selectInputArray') as FormArray;
  }

  get dateInputForm() {
    return this.form.get('dateInputArray') as FormArray;
  }

  ngOnInit() {
    this.textInput?.forEach((input) => {
      this.textInputForm.push(this.fb.control(input.value, { validators: input.required ? Validators.required : null }));
    });
    this.numberInput?.forEach((input) => {
      this.numberInputForm.push(this.fb.control(input.value, { validators: input.required ? Validators.required : null }));
    });

    this.selectInput?.forEach((input) => {
      this.selectInputForm.push(this.fb.control(input.value, { validators: input.required ? Validators.required : null }));
    });

    this.dateInput?.forEach((input) => {
      this.dateInputForm.push(this.fb.control(input.value, { validators: input.required ? Validators.required : null }));
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.warning();
      return;
    } else {
      console.log(this.form.value);
      this.success();
      this.submit.emit(this.form.value);
    }
  }

  onReset() {
    this.form.reset();
  }

  success() {
    this.messageService.add(this.successToast || { severity: 'success', summary: 'Success', detail: 'Form submitted' });
  }

  error() {
    this.messageService.add(this.errorToast || { severity: 'error', summary: 'Error', detail: 'Form not submitted' });
  }

  warning() {
    this.messageService.add(
      this.warningToast || {
        severity: 'warn',
        summary: 'Warning',
        detail: 'Form not submitted',
      },
    );
  }
}
