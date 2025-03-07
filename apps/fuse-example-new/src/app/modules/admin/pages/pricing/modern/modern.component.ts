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
    selector: 'pricing-modern',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, NgClass, FuseCardComponent, MatIconModule],
})
export class PricingModernComponent {
    yearlyBilling: boolean = true;

    /**
     * Constructor
     */
    constructor() {}
}
