import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OtherComponentsComponent } from 'app/modules/admin/ui/other-components/other-components.component';

@Component({
  selector: 'quill-editor',
  templateUrl: './quill-editor.component.html',
  imports: [MatIconModule, MatButtonModule],
})
export class QuillEditorComponent {
  /**
   * Constructor
   */
  constructor(private _otherComponentsComponent: OtherComponentsComponent) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the drawer
   */
  toggleDrawer(): void {
    // Toggle the drawer
    this._otherComponentsComponent.matDrawer.toggle();
  }
}
