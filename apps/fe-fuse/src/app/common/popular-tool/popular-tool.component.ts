import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BabyNameFinderComponent } from '../baby-name-finder/baby-name-finder.component';
import { CalculateDueDateComponent } from '../calculate-due-date/calculate-due-date.component';
import { WeekPregnancySliderComponent } from '../week-pregnancy-slider/week-pregnancy-slider.component';

@Component({
  selector: 'app-popular-tool',
  imports: [MatDialogModule],
  templateUrl: './popular-tool.component.html',
  styleUrl: './popular-tool.component.css',
})
export class PopularToolComponent {
  readonly dialog = inject(MatDialog);

  // Baby's name finder
  openFirstTool() {
    const dialogRef = this.dialog.open(BabyNameFinderComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Calculate due date
  openSecondTool() {
    const dialogRef = this.dialog.open(CalculateDueDateComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Week pregnancy slider
  openThirdTool() {
    const dialogRef = this.dialog.open(WeekPregnancySliderComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
