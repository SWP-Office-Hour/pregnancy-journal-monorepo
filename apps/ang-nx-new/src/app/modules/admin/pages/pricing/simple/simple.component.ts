import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector: 'pricing-simple',
    templateUrl: './simple.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, NgClass, FuseCardComponent, MatIconModule],
})
export class PricingSimpleComponent {
    yearlyBilling: boolean = true;

    /**
     * Constructor
     */
    constructor() {}
}
