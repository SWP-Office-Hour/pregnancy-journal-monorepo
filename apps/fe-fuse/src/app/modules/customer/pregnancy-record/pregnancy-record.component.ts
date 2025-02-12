import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RecordFormComponent } from './form/record-form.component';

@Component({
  selector: 'app-pregnancy-service',
  standalone: true,
  imports: [CommonModule, RecordFormComponent],
  templateUrl: './pregnancy-record.component.html',
  styleUrl: './pregnancy-record.component.css',
})
export class PregnancyRecordComponent {}
