import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsFieldsComponent } from '../modules/admin/ui/forms/fields/fields.component';

@Component({
  selector: 'app-pregnancy-record',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    FormsFieldsComponent,
  ],
  templateUrl: './pregnancy-record.component.html',
})
export class PregnancyRecordComponent {}
