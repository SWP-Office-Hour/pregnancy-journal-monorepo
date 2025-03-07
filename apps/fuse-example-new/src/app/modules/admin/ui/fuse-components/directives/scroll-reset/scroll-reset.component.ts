import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';
import { FuseComponentsComponent } from 'app/modules/admin/ui/fuse-components/fuse-components.component';

@Component({
    selector: 'scroll-reset',
    templateUrl: './scroll-reset.component.html',
    imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
})
export class ScrollResetComponent {
    /**
     * Constructor
     */
    constructor(private _fuseComponentsComponent: FuseComponentsComponent) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle the drawer
     */
    toggleDrawer(): void {
        // Toggle the drawer
        this._fuseComponentsComponent.matDrawer.toggle();
    }
}
