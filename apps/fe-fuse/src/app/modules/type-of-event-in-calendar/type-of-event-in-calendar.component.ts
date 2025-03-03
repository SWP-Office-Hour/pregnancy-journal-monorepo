import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Theme {
  id: number;
  name: string;
  color: string;
}
@Component({
  selector: 'app-type-of-event-in-calendar',
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, FormsModule, ButtonModule],
  templateUrl: './type-of-event-in-calendar.component.html',
  styleUrl: './type-of-event-in-calendar.component.css',
})
export class TypeOfEventInCalendarComponent implements OnInit {
  themes: Theme[] = [];
  showModal = false;
  themeForm: FormGroup;
  removeAfterDrop = false;

  predefinedColors = ['#A0C4FF', '#CAFFBF', '#D8C4FF', '#FFD4A0', '#FFBFCB'];

  constructor(private fb: FormBuilder) {
    this.themeForm = this.fb.group({
      name: ['', [Validators.required]],
      color: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadThemes();
  }

  loadThemes(): void {
    const savedThemes = localStorage.getItem('themes');
    if (savedThemes) {
      this.themes = JSON.parse(savedThemes);
    }
  }

  saveThemes(): void {
    localStorage.setItem('themes', JSON.stringify(this.themes));
  }

  openThemeModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.themeForm.reset();
  }

  selectColor(color: string): void {
    this.themeForm.patchValue({ color });
  }

  createTheme(): void {
    if (this.themeForm.valid) {
      const newTheme: Theme = {
        id: Date.now(),
        name: this.themeForm.value.name,
        color: this.themeForm.value.color,
      };

      this.themes.push(newTheme);
      this.saveThemes();
      this.closeModal();
    }
  }

  deleteTheme(theme: Theme): void {
    this.themes = this.themes.filter((t) => t.id !== theme.id);
    this.saveThemes();
  }
}
