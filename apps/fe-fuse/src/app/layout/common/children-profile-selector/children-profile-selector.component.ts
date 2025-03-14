import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChildType, Gender } from '@pregnancy-journal-monorepo/contract';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { environment } from '../../../../environments/environment';
import { ChildV2Service } from '../../../core/children/child.v2.service';

@Component({
  selector: 'app-children-profile-selector',
  imports: [CommonModule, DropdownModule, ButtonModule, FormsModule],
  templateUrl: './children-profile-selector.component.html',
  styleUrl: './children-profile-selector.component.css',
})
export class ChildrenProfileSelectorComponent implements OnInit {
  protected gender = Gender;
  children: WritableSignal<ChildType[]> = signal([]);
  selectedChild: WritableSignal<ChildType> = signal(null);
  selectedChildId: string = null;
  childrenOptions = signal<ChildType[]>([]);

  constructor(
    private http: HttpClient,
    private childV2Service: ChildV2Service,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.http.get<ChildType[]>(environment.apiUrl + 'child').subscribe((children) => {
      this.children.set(children);
      this.childrenOptions.set(children);

      this.childV2Service.child$.subscribe((child) => {
        this.selectedChild.set(child);
        if (child) {
          this.selectedChildId = child.child_id;
        }
      });
    });
  }

  onChildChange(event: any): void {
    const selectedChild = this.children().find((child) => child.child_id === event.value);
    if (selectedChild) {
      this.selectedChild.set(selectedChild);
      this.childV2Service.child = selectedChild;
    }
  }
}
