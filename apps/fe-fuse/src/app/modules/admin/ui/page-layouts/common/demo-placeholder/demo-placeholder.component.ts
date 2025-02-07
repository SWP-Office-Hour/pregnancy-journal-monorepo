import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'demo-placeholder',
    template: `
        <div
            class="h-400 max-h-400 min-h-400 w-full rounded-2xl border-2 border-dashed border-gray-300"
        ></div>
    `,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
})
export class DemoPlaceholderComponent {
    /**
     * Constructor
     */
    constructor() {}
}
