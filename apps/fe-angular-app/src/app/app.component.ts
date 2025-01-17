import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [NxWelcomeComponent, RouterModule, TuiRoot],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'fe-angular-app';
}
