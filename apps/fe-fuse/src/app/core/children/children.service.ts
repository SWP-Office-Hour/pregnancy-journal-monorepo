import { effect, Injectable, signal } from '@angular/core';
import { ChildType } from '@pregnancy-journal-monorepo/contract';

@Injectable({
  providedIn: 'root',
})
export class ChildrenService {
  public children = signal<ChildType[]>([]);
  public selectedChild = signal<string>('');

  constructor() {
    effect(() => {});
  }

  get Children(): ChildType[] {
    return this.children();
  }

  set Children(children: ChildType[]) {
    this.children.set(children);
  }

  get SelectedChild() {
    return this.selectedChild();
  }

  getSelectedChild() {
    return this.children().find((child) => child.child_id === this.selectedChild());
  }

  set SelectedChild(child_id: string) {
    this.selectedChild.set(child_id);
  }
}
