import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, resource, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Membership } from '@pregnancy-journal-monorepo/contract';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'pricing-modern',
  templateUrl: './modern.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CardModule, ButtonModule],
})
export class PricingModernComponent {
  yearlyBilling: boolean = true;
  protected memberships: Membership[] = [];
  responsiveOptions: any[] | undefined;

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
  constructor(private _httpClient: HttpClient) {
    console.log(this.memberships);
    console.log('membershipResource');
    console.log(this.membershipResource.value());
    effect(() => {
      console.log('membershipResource');
      console.log(this.membershipResource.value());
    });
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  click(event: Event) {
    console.log('click', event);
  }
}
