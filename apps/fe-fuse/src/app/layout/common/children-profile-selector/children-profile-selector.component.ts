import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Child {
  id: string;
  name: string;
  avatarUrl?: string;
  gender?: 'male' | 'female';
}

@Component({
  selector: 'app-children-profile-selector',
  imports: [CommonModule],
  templateUrl: './children-profile-selector.component.html',
  styleUrl: './children-profile-selector.component.css',
})
export class ChildrenProfileSelectorComponent implements OnInit {
  isOpen = false;
  selectedChild: Child | null = null;

  // Mock data - will be replaced with actual data service
  children: Child[] = [
    { id: '1', name: 'Emma Johnson', gender: 'female', avatarUrl: 'https://avatar.iran.liara.run/public/22' },
    { id: '2', name: 'Noah Smith', gender: 'male', avatarUrl: 'https://avatar.iran.liara.run/public/24' },
    { id: '3', name: 'Olivia Williams', gender: 'female' },
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize with first child selected
    if (this.children.length > 0) {
      this.selectedChild = this.children[0];
    }
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  selectChild(child: Child): void {
    this.selectedChild = child;
    this.isOpen = false;
    // Navigation logic will be implemented later
    console.log('Selected child:', child);
  }
}
