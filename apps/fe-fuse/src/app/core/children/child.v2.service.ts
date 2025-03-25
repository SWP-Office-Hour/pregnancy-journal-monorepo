import { Injectable, signal } from '@angular/core';
import { ChildType } from '@pregnancy-journal-monorepo/contract';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChildV2Service {
  constructor() {}

  private _child: ReplaySubject<ChildType> = new ReplaySubject<ChildType>(1);
  private _children = signal<ChildType[]>([]);

  set child(value: ChildType) {
    this._child.next(value);
  }

  get child$(): Observable<ChildType> {
    return this._child.asObservable();
  }

  get children$() {
    return this._children;
  }

  set children(children: ChildType[]) {
    this._children.set(children);
  }
}
