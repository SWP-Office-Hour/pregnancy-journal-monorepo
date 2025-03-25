import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signUpForm: UntypedFormGroup;
  showAlert = signal(false);

  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _httpClient: HttpClient,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.signUpForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      agreements: ['', Validators.requiredTrue],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  // signUp(): void {
  //   // Do nothing if the form is invalid
  //   if (this.signUpForm.invalid) {
  //     return;
  //   }
  //
  //   // Disable the form
  //   this.signUpForm.disable();
  //
  //   // Hide the alert
  //   this.showAlert.set(false);
  //
  //   console.log(this.signUpForm.value);
  //
  //   // Sign up
  //   this._authService.confirmationRequired(this.signUpForm.value).subscribe({
  //     next: (confirm_signup: string) => {
  //       // Navigate to the confirmation required page
  //       console.log(confirm_signup);
  //       this._router.navigateByUrl(confirm_signup);
  //     },
  //     error: (error) => {
  //       // Re-enable the form
  //       this.signUpForm.enable();
  //
  //       // Set the alert
  //       this.alert = {
  //         type: 'error',
  //         message: error.message,
  //       };
  //
  //       // Show the alert
  //       this.showAlert.set(true);
  //     },
  //   });
  // }

  signUp(): void {
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      Object.keys(this.signUpForm.controls).forEach((key) => {
        this.signUpForm.get(key).markAsDirty();
        this.signUpForm.get(key).markAsTouched();
      });
      return;
    }

    // Check email availability one final time
    const email = this.signUpForm.get('email').value;
    fetch(environment.apiUrl + 'users/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to check email availability');
        }
        return response.json();
      })
      .then((res) => {
        //if mail is available/not exist
        this._authService.confirmationRequired(this.signUpForm.value).subscribe({
          next: (confirm_signup: string) => {
            // Navigate to the confirmation required page
            console.log(confirm_signup);
            this._router.navigateByUrl(confirm_signup);
          },
          error: (error) => {
            // Re-enable the form
            this.signUpForm.enable();

            // Set the alert
            this.alert = {
              type: 'error',
              message: error.message,
            };

            // Show the alert
            this.showAlert.set(true);
          },
        });
      })
      .catch((error) => {
        this.alert = {
          type: 'error',
          message: 'Email này đã được sử dụng',
        };
        this.showAlert.set(true);
        console.log(error);
        return;
      });
  }
}
