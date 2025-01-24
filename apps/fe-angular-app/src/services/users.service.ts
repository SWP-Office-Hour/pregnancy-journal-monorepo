import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  profile = signal<any>(null);

  // login() {}
}
