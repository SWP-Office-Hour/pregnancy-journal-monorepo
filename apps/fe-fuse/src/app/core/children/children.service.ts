import { Injectable, signal } from '@angular/core';
import { ChildType } from '@pregnancy-journal-monorepo/contract';

@Injectable({
  providedIn: 'root',
})
export class ChildrenService {
  private children = signal<ChildType[]>([]);
  private selectedChild = signal<string>('');

  constructor() {}

  get Children() {
    return this.children;
  }

  get SelectedChild() {
    return this.selectedChild();
  }

  getSearchedChild() {
    return this.children().find((child) => child.child_id === this.selectedChild());
  }

  set SelectedChild(child_id: string) {
    this.selectedChild.set(child_id);
  }
}
