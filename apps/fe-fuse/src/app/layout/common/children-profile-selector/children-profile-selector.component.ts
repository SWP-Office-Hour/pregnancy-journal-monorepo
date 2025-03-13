import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, WritableSignal } from '@angular/core';
import { ChildType, Gender } from '@pregnancy-journal-monorepo/contract';
import { ChildrenService } from '../../../core/children/children.service';

@Component({
  selector: 'app-children-profile-selector',
  imports: [CommonModule],
  templateUrl: './children-profile-selector.component.html',
  styleUrl: './children-profile-selector.component.css',
})
export class ChildrenProfileSelectorComponent implements OnInit {
  isOpen = false;
  // Mock data - will be replaced with actual data service
  protected gender = Gender;
  private _childService = inject(ChildrenService);
  selectedChild = computed(() => this._childService.children().find((child) => child.child_id === this._childService.selectedChild()));
  children: WritableSignal<ChildType[]> = this._childService.children;

  constructor() {
    effect(() => {
      console.log('Children:', this.children());
      console.log('In service', this._childService.children());
    });
  }

  ngOnInit(): void {
    // Initialize with first child selected
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectChild(child: ChildType): void {
    this._childService.selectedChild.set(child.child_id);
    this.isOpen = false;
    // Navigation logic will be implemented later
    console.log('Selected child:', child);
  }
}
