import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TrackingFormComponent } from '../form/tracking-form.component';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-record-table',
  imports: [TableModule, ToastModule, ButtonModule, CommonModule, Ripple, RouterLink],
  providers: [MessageService],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.css',
})
export class RecordTableComponent implements OnInit {
  expandedRows = {};
  protected recordsData: RecordResponse[] = [];
  protected rows: { week: number; records: RecordResponse[] }[] = [
    {
      week: 10,
      records: [],
    },
    {
      week: 20,
      records: [],
    },
    {
      week: 30,
      records: [],
    },
    {
      week: 40,
      records: [],
    },
  ];

  constructor(
    private messageService: MessageService,
    private recordService: PregnancyTrackingService,
    private _dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.recordService.RecordData.subscribe((data) => {
      this.recordsData = data();
      this.recordsData.forEach((record) => {
        this.rows.find((r) => r.week <= record.week)!.records.push(record);
      });
    });
  }

  expandAll() {
    // this.expandedRows = this.products.reduce((acc, p) => (acc[p.id] = true) && acc, {});
    this.expandedRows = this.rows.reduce((acc, r) => (acc[r.week] = true) && acc, {});
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getLength(week: number) {
    return this.rows.find((r) => r.week === week)!.records.length;
  }

  onRowExpand(event: TableRowExpandEvent) {
    this.messageService.add({ severity: 'info', summary: 'Row Expanded', detail: event.data.name, life: 3000 });
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    this.messageService.add({ severity: 'success', summary: 'Row Collapsed', detail: event.data.name, life: 3000 });
  }

  editTracking(record_id: string) {
    this.recordService.SelectedRecordData = record_id;
    console.log(this.recordService.SelectedRecordData);
    this._dialog.open(TrackingFormComponent, {
      autoFocus: false,
    });
  }
}
