import { JsonPipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'example',
  standalone: true,
  templateUrl: './example.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe],
})
export class ExampleComponent {
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
