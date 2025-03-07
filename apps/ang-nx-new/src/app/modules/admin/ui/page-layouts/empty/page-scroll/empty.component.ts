import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'empty-page-scroll',
    templateUrl: './empty.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [CdkScrollable],
})
export class EmptyPageScrollComponent {
    /**
     * Constructor
     */
    constructor() {}
}
