import { Injectable } from '@angular/core';
import { ChildType } from '@pregnancy-journal-monorepo/contract';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChildV2Service {
  constructor() {}

  private _child: ReplaySubject<ChildType> = new ReplaySubject<ChildType>(1);

  set child(value: ChildType) {
    localStorage.setItem('child', JSON.stringify(value));
    this._child.next(value);
  }

  get child$() {
    return this._child.asObservable();
  }
}
