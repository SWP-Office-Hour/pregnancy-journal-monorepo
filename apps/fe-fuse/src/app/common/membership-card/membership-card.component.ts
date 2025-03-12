import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { membershipDay, membershipResponse } from '@pregnancy-journal-monorepo/contract';
import { membershipService } from '../../core/membership/membership.service';

@Component({
  selector: 'app-membership-card',
  imports: [CommonModule],
  templateUrl: './membership-card.component.html',
  styleUrl: './membership-card.component.css',
  standalone: true,
  animations: [
    trigger('pulseAnimation', [
      state(
        'normal',
        style({
          transform: 'scale(1)',
        }),
      ),
      state(
        'pulse',
        style({
          transform: 'scale(1.05)',
        }),
      ),
      transition('normal <=> pulse', animate('0.5s ease-in-out')),
    ]),
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      state(
        '*',
        style({
          opacity: 1,
        }),
      ),
      transition('void <=> *', animate('0.3s ease-in-out')),
    ]),
    trigger('highlightBorder', [
      state(
        'inactive',
        style({
          borderColor: 'var(--border-color-normal)',
        }),
      ),
      state(
        'active',
        style({
          borderColor: 'var(--primary-color)',
          boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.3)',
        }),
      ),
      transition('inactive <=> active', animate('0.4s ease-in-out')),
    ]),
  ],
})
export class MembershipCardComponent {
  @Input() membership!: membershipResponse;
  @Input() isYearly: boolean = false;
  @Input() savingsPercentage: number = 0;
  @Output() selected = new EventEmitter<void>();

  pulseState: 'normal' | 'pulse' = 'normal';
  highlightState: 'inactive' | 'active' = 'inactive';

  constructor(private membershipService: membershipService) {}

  ngOnInit() {
    // Initialize animations if this is a special membership
    if (this.isSpecialBadge) {
      this.startPulseAnimation();
    }
  }

  getDurationLabel(duration: membershipDay): string {
    return this.membershipService.getDurationLabel(duration);
  }

  onSelect(): void {
    // Briefly highlight the card when selected
    this.highlightState = 'active';
    setTimeout(() => {
      this.highlightState = 'inactive';
      this.selected.emit();
    }, 300);
  }

  getBadgeClass(duration: membershipDay): string {
    return this.membershipService.getBadgeClass(duration);
  }

  get isSpecialBadge(): boolean {
    return this.getBadgeClass(this.membership?.duration_days) === 'TIẾT KIỆM';
  }

  startPulseAnimation(): void {
    // Create a repeating pulse effect for special memberships
    setInterval(() => {
      this.pulseState = this.pulseState === 'normal' ? 'pulse' : 'normal';
    }, 2000);
  }

  // Manually trigger pulse on hover
  onCardHover(): void {
    if (!this.isSpecialBadge) {
      this.pulseState = 'pulse';
    }
  }

  onCardLeave(): void {
    if (!this.isSpecialBadge) {
      this.pulseState = 'normal';
    }
  }
}
