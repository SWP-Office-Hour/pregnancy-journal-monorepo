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
  membership?: membershipResponse;
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
    console.log(this.membership);
    const response = this.membershipService.createPayment({ membership_id: this.membership.membership_id });

    response
      .then((res) => {
        console.log('Server response:', res);

        try {
          console.log('Payment success:', res.message);
          this.messageService.add({
            severity: 'success',
            summary: 'Membership',
            detail: res.message,
            life: 3000,
          });
          window.location.href = res.payment_url;
        } catch (error) {
          console.log('Payment failed:', res.message);
          this.messageService.add({
            severity: 'error',
            summary: 'Membership',
            detail: res.message || 'Thanh toán thất bại',
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Đã xảy ra lỗi khi xử lý thanh toán',
          life: 3000,
        });
      });
  }
}
