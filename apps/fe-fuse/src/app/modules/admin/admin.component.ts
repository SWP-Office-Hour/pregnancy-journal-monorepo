import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [MatButton, MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule],
})
export class AdminComponent {
  recentTransactionsTableColumns = ['transactionId', 'date', 'name', 'amount', 'status'];
  recentTransactionsDataSource = new MatTableDataSource([
    { transactionId: '12345', date: 'Jan 01, 2023', name: 'John Doe', amount: 100, status: 'completed' },
  ]);
  trackByFn(index: number, item: any) {
    return item.transactionId;
  }
}
