import { ChangeDetectionStrategy, Component, effect, resource, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { Membership } from '@pregnancy-journal-monorepo/contract';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'pricing-modern',
  templateUrl: './membership.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CarouselModule, MatButtonModule, MatIconModule, CardModule, ButtonModule, FuseCardComponent],
})
export class PricingModernComponent {
  yearlyBilling: boolean = true;
  protected memberships: Membership[] = [];

  membershipResource = resource<Membership[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'memberships', {
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      return await response.json();
    },
  });

  /**
   * Constructor
   */
  constructor() {
    //dùng để coi giá trị của resource
    effect(() => {
      console.log('membershipResource');
      console.log(this.membershipResource.value());
    });
  }

  click(event: Event) {
    console.log('click', event);
  }
}
