import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, resource } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ChildType, Gender } from '@pregnancy-journal-monorepo/contract';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { FuseCardComponent } from '../../../@fuse/components/card';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { ChildV2Service } from '../../core/children/child.v2.service';
import { UserService } from '../../core/user/user.service';
import { ChildrenProfileTableComponent } from './children-profile-table/children-profile-table.component';

@Component({
  selector: 'app-children-profile-insert',
  templateUrl: './children-profile.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    DatePickerModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    ToastModule,
    CarouselModule,
    MatButtonModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    FuseCardComponent,
    FuseCardComponent,
    CarouselModule,
    MatButtonModule,
    MatIconModule,
    CardModule,
    ButtonModule,
    FuseCardComponent,
    FuseCardComponent,
    MatDialogModule,
    ConfirmDialogModule,
    RouterLink,
  ],
  providers: [MessageService, ConfirmationService],
})
export class ChildrenProfileComponent {
  childResource = resource<ChildType[], {}>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(environment.apiUrl + 'child', {
        headers: {
          Authorization: `Bearer ${this._authService.accessToken}`,
        },
        signal: abortSignal,
      });
      if (!response.ok) throw Error(`Could not fetch...`);
      const data: ChildType[] = await response.json();

      return data.map((item: ChildType) => {
        return {
          child_id: item.child_id,
          name: item.name || 'Em bé chưa đặt tên',
          expected_birth_date: new Date(item.expected_birth_date),
          gender: item.gender || null,
          user_id: item.user_id,
        };
      });
    },
  });
  protected Gender = Gender;

  /**
   * Constructor
   */
  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private _authService: AuthService,
    private confirmationService: ConfirmationService,
    private _userService: UserService,
    private _childService: ChildV2Service,
    private _router: Router,
    private http: HttpClient,
  ) {
    //dùng để coi giá trị của resource
    effect(() => {});
  }

  getGenderText(genderValue: number | undefined | null): string {
    if (genderValue == undefined) return 'Chưa xác định';
    return genderValue === Gender.FEMALE ? 'Nữ' : 'Nam';
  }

  getDaysUntilDueDate(dueDate: Date): number {
    const expectedDate = new Date(dueDate);
    const currentDate = new Date();
    const diffDays = Math.floor((expectedDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  openDialog(child?: ChildType): void {
    const dialogRef = this.dialog.open(ChildrenProfileTableComponent, {
      width: '700px', // Increased from 500px
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      data: { child: child },
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh data
        this.childResource.reload();
      }
    });
  }

  deleteChild(child: ChildType): void {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa hồ sơ của "${child.name}" không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        fetch(environment.apiUrl + `child/${child.child_id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this._authService.accessToken}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              this.http.get<ChildType[]>(environment.apiUrl + 'child/').subscribe((children) => {
                this._childService.children = children;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thành công',
                  detail: `Đã xóa hồ sơ của ${child.name}`,
                  life: 3000,
                });
                this.childResource.reload();
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Không thể xóa hồ sơ',
                life: 3000,
              });
            }
          })
          .catch((error) => {
            console.error('Error deleting child profile:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Đã xảy ra lỗi khi xóa hồ sơ',
              life: 3000,
            });
          });
      },
    });
  }

  createChildRecord(_child: ChildType): void {
    this._userService.user$.subscribe((user) => {
      this._childService.child = user.child.find((c) => c.child_id == _child.child_id);
      this._router.navigate(['/tracking'], { queryParams: { create: true } });
    });
  }

  formatDateInVietnamese(date: Date | null): string {
    if (!date) {
      return '';
    }

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    return new Date(date).toLocaleDateString('vi', options);
  }
}
