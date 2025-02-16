import { Component, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-calendar',
  imports: [MatSelectModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  protected open = signal(false);

  clickSelector() {
    this.open.set(!this.open());
  }
}
