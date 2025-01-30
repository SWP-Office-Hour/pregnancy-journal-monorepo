import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private form: FormGroup;
  constructor() {
    this.form = new FormGroup({});
  }
}
