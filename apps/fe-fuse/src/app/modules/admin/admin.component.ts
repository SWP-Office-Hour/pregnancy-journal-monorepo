import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
  // private authService = inject(AuthGoogleService);
  // private router = inject(Router);
  // profile = this.authService.profile;
  //
  // logOut() {
  //   this.authService.logout();
  //
  //   this.router.navigate(['/signin']);
  // }

  /**
   * Constructor
   */
  constructor() {}
}
