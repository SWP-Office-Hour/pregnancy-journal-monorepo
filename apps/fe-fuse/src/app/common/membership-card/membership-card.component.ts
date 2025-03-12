import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { membershipDay, membershipResponse } from '@pregnancy-journal-monorepo/contract';
import { membershipService } from '../../core/membership/membership.service';

@Component({
  selector: 'app-membership-card',
  imports: [CommonModule],
  templateUrl: './membership-card.component.html',
  styleUrl: './membership-card.component.css',
})
export class MembershipCardComponent {
  @Input() membership!: membershipResponse;
  @Input() isYearly: boolean = false;
  @Input() savingsPercentage: number = 0;
  @Output() selected = new EventEmitter<void>();

  constructor(private membershipService: membershipService) {}

  getDurationLabel(duration: membershipDay): string {
    return this.membershipService.getDurationLabel(duration);
  }

  onSelect(): void {
    this.selected.emit();
  }
}
