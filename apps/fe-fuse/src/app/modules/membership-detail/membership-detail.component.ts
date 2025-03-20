import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { membershipDay, membershipResponse } from '@pregnancy-journal-monorepo/contract';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { membershipService } from '../../core/membership/membership.service';

@Component({
  selector: 'app-membership-detail',
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './membership-detail.component.html',
  styleUrl: './membership-detail.component.css',
})
export class MembershipDetailComponent implements OnInit {
  membership: membershipResponse | undefined;
  paymentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private membershipService: membershipService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {
    this.paymentForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.membershipService.getMembershipById(id).subscribe((membership) => {
        this.membership = membership;
      });
    }
  }

  getDurationLabel(duration: membershipDay): string {
    return this.membershipService.getDurationLabel(duration);
  }

  goBack(): void {
    this.router.navigate(['/membership']);
  }

  onSubmit(): void {
    if (!this.membership) return;
    console.log(this.membership);
    const response = this.membershipService.createPayment({ membership_id: this.membership.membership_id });

    response.then((res) => {
      console.log('Server response:', res);
      this.messageService.add({
        severity: 'error',
        summary: 'Membership',
        detail: res.message,
        life: 3000,
      });
    });
  }
}
