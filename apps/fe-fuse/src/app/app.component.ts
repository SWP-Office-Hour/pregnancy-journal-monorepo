import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgAutoAnimateDirective } from 'ng-auto-animate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NgAutoAnimateDirective],
})
export class AppComponent {
  /**
   * Constructor
   */
  constructor() {}
}
