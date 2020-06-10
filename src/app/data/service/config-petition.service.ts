import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { SnackbarService } from './snackbar.service';
import { ConfirmAddDialogModel, AddProcessComponent } from 'src/app/modules/config-petition/dialog/add-process/add-process.component';
import { reloadTimeout } from './config.service';
import {
  ConfirmUpdateDialogModel,
  UpdateProcessComponent
} from 'src/app/modules/config-petition/dialog/update-process/update-process.component';
import {
  ConfirmDrawDialogModel,
  DrawProcessComponent
} from 'src/app/modules/config-petition/dialog/draw-process/draw-process.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigPetitionService {

  result: boolean;

  constructor(private dialog: MatDialog,
              private main: SnackbarService) { }

  addProcess(): void {
    const dialogData = new ConfirmAddDialogModel('Thêm mới quy trình');
    const dialogRef = this.dialog.open(AddProcessComponent, {
      width: '80%',
      height: '450px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Quy trình';
    const content = '';
    const result = 'được thêm thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      const data = dialogResult;
      if (data.data.id != null) {
        const body = JSON.parse(data.body);
        this.main.openSnackBar(message, body.title, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function() {
          window.location.replace('/cau-hinh-phan-anh/chi-tiet/' + data.data.id);
        }, reloadTimeout);
      }
      if (data.data.id === null) {
        this.main.openSnackBar('Thêm quy trình', content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  drawProcess(): void {
    const dialogData = new ConfirmDrawDialogModel('Vẽ quy trình');
    const dialogRef = this.dialog.open(DrawProcessComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });
  }

  updateProcess(id, name): void {
    const dialogData = new ConfirmUpdateDialogModel('Cập nhật thông báo', id);
    const dialogRef = this.dialog.open(UpdateProcessComponent, {
      width: '80%',
      height: '500px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Cập nhật quy trình';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

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
    const dialogData = new ConfirmApplyDialogModel('Áp dụng quy trình', name, id);
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