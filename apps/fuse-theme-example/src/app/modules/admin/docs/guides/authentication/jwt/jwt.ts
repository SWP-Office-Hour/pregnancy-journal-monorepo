import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GuidesComponent } from 'app/modules/admin/docs/guides/guides.component';

@Component({
  selector: 'jwt',
  templateUrl: './jwt.html',
  imports: [MatIconModule, MatButtonModule],
})
export class JwtComponent {
  /**
   * Constructor
   */
  constructor(private _guidesComponent: GuidesComponent) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the drawer
   */
  toggleDrawer(): void {
    // Toggle the drawer
    this._guidesComponent.matDrawer.toggle();
  }
}
