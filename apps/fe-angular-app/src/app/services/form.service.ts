import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private form: FormGroup;
  constructor() {
    this.form = new FormGroup({});
  }
}
