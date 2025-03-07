import { CdkScrollable } from '@angular/cdk/scrolling';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';

@Component({
    selector: 'compact',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CdkScrollable],
})
export class CompactComponent {
    /**
     * Constructor
     */
    constructor() {}
}
