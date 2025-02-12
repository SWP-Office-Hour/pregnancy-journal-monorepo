import { WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export function addControlToForm({
  controlName,
  formGroup,
  controlType,
  selectItems,
  controlValue,
  controlLabel,
  formControls,
}: {
  controlName: string;
  controlValue: any;
  controlType: 'Number' | 'Select' | 'Date';
  controlLabel: string;
  selectItems?: any[];
  formGroup: FormGroup;
  formControls: WritableSignal<formControls>;
}) {
  switch (controlType) {
    case 'Number':
      formGroup.addControl(controlName, new FormControl(controlValue || 0));
      break;
    case 'Select':
      formGroup.addControl(controlName, new FormControl(controlValue || ''));
      break;
    case 'Date':
      formGroup.addControl(controlName, new FormControl(controlValue || new Date()));
      break;
  }
  formControls().push({ controlLabel, controlName, controlType, selectItems });
}

export type formControls = {
  controlLabel: string;
  controlName: string;
  controlType: 'Number' | 'Select' | 'Date';
  selectItems?: any[];
}[];
