import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiFiles } from '@taiga-ui/kit';
import { PregnancyTrackingService } from '../pregnancy-tracking.service';

@Component({
  selector: 'app-file-upload',
  imports: [ReactiveFormsModule, TuiFiles],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.css',
})
export class FileUploadComponent {
  protected readonly control = new FormControl<File[]>([]);

  private readonly pregnancyService = inject(PregnancyTrackingService);

  protected onFileChange(event: Event): void {
    const reader = new FileReader();
    const file = (event.target as HTMLInputElement).files![0];
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.pregnancyService.addImage({
          id: new Date().getTime().toString(),
          mediaUrl: reader.result as string,
        });
      };
    }
  }
}
