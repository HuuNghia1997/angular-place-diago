import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupService } from './popup.service';
import {
  ConfirmDeleteDialogModel,
  DeleteProcessComponent
} from 'src/app/modules/config-petition/dialog/delete-process/delete-process.component';
import {
  ConfirmUnapplyDialogModel,
  UnapplyProcessComponent
} from 'src/app/modules/config-petition/dialog/unapply-process/unapply-process.component';
import {
  ApplyProcessComponent,
  ConfirmApplyDialogModel
} from 'src/app/modules/config-petition/dialog/apply-process/apply-process.component';

@Injectable()
export class ConfigPetitionService {

  result: boolean;

  constructor(private dialog: MatDialog,
              private main: PopupService) { }

  deleteProcess(id, name): void {
    const dialogData = new ConfirmDeleteDialogModel('Xóa quy trình', name, id);
    const dialogRef = this.dialog.open(DeleteProcessComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });

    const message = 'Xóa';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  unApplyProcess(id, name): void {
    const dialogData = new ConfirmUnapplyDialogModel('Hủy áp dụng quy trình', name, id);
    const dialogRef = this.dialog.open(UnapplyProcessComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });

    const message = 'Hủy áp dụng';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  applyProcess(id, name): void {
    const dialogData = new ConfirmApplyDialogModel('Hủy áp dụng quy trình', name, id);
    const dialogRef = this.dialog.open(ApplyProcessComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });

    const message = 'Áp dụng';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  formErrorMessage(id: number) {
    switch (id) {
      case 1:
        return 'Vui lòng nhập tên quy trình';
      case 2:
        return 'Vui lòng chọn chuyên mục';
      case 3:
        return 'Vui lòng chọn đơn vị';
      default:
        return 'You must enter a valid value';
    }
  }
}
