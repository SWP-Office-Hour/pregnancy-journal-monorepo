import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ChildType, RecordResponse } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TrackingFormComponent } from '../form/tracking-form.component';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';
import { SignalPregnancyTrackingService } from '../signal-pregnancy-tracking.service';

@Component({
  selector: 'app-record-table',
  imports: [TableModule, ToastModule, ButtonModule, CommonModule, Ripple, FormsModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.css',
})
export class RecordTableComponent implements OnInit {
  expandedRows = {};
  searchText: string = '';
  protected recordsData: RecordResponse[] = [];
  protected originalRecords: RecordResponse[] = []; // Store the original data for filtering
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
  protected originalRows: { week: number; records: RecordResponse[] }[] = []; // Store original rows for filtering
  //flag expand all
  protected isExpanded: boolean = false;
  protected child = signal<ChildType>({} as ChildType);

  constructor(
    private recordService: PregnancyTrackingService,
    private signalPregnancyTrackingService: SignalPregnancyTrackingService,
    private _dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.child = this.signalPregnancyTrackingService.globalSelectedChild;
    effect(() => {
      if (this.child() != undefined) {
        this.getRecords();
      }
    });
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['create'] == 'true') {
      this.createRecord();
    }
    this.getRecords();
  }

  getRecords() {
    this.recordService.RecordData$.subscribe((data) => {
      this.recordsData = data();
      this.originalRecords = [...this.recordsData]; // Store original data

      // Reset rows data before populating
      this.rows.forEach((row) => (row.records = []));

      this.recordsData.forEach((record) => {
        this.rows.find((r) => r.week >= record.week)!.records.push(record);
      });

      // Store the original rows structure after populating
      this.originalRows = JSON.parse(JSON.stringify(this.rows));
    });
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {
      this.expandAll();
    } else {
      this.collapseAll();
    }
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

  editTracking(record_id: string) {
    this.recordService.SelectedRecordData = record_id;
    if (this.recordService.SelectedRecordData) {
      const dialogRef = this._dialog.open(TrackingFormComponent, {
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(() => {
        this.recordService.RecordData$.subscribe();
        this.recordService.closeForm();
      });
    } else {
      console.log('Record not found. Id ', record_id);
    }
  }

  searchRecords() {
    if (!this.searchText || this.searchText.trim() === '') {
      // If search is empty, restore original data
      this.rows = JSON.parse(JSON.stringify(this.originalRows));
      return;
    }

    const searchTerm = this.searchText.toLowerCase().trim();

    // Create a deep copy of the original rows structure
    const filteredRows: { week: number; records: RecordResponse[] }[] = JSON.parse(JSON.stringify(this.originalRows));

    // Filter records in each week group
    filteredRows.forEach((weekGroup: { week: number; records: RecordResponse[] }) => {
      weekGroup.records = weekGroup.records.filter(
        (record) =>
          // Search by different record properties
          record.week.toString().includes(searchTerm) ||
          record.hospital?.name?.toLowerCase().includes(searchTerm) ||
          record.doctor_name?.toLowerCase().includes(searchTerm) ||
          this.formatDate(new Date(record.visit_doctor_date).toString()).toLowerCase().includes(searchTerm) ||
          this.formatDate(new Date(record.next_visit_doctor_date).toString()).toLowerCase().includes(searchTerm),
      );
    });

    // Update the displayed rows with filtered data
    this.rows = filteredRows;

    // Auto expand rows that have matching records
    this.expandedRows = {};
    filteredRows.forEach((row) => {
      if (row.records.length > 0) {
        this.expandedRows[row.week] = true;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  clearSearch() {
    this.searchText = '';
    this.rows = JSON.parse(JSON.stringify(this.originalRows));
    this.expandedRows = {};
  }

  createRecord() {
    this.recordService.SelectedRecordData = '';
    const dialogRef = this._dialog.open(TrackingFormComponent, {
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.recordService.RecordData$.subscribe();
        this.recordService.closeForm();
      }
    });
  }
}
