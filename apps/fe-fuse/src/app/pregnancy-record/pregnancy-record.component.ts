import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PregnancyRecordFormComponent } from './pregnancy-tracking-form/pregnancy-record-form.component';

@Component({
  selector: 'app-pregnancy-record',
  standalone: true,
  imports: [CommonModule, PregnancyRecordFormComponent],
  templateUrl: './pregnancy-record.component.html',
  styleUrl: './pregnancy-record.component.css',
})
export class PregnancyRecordComponent {}
