import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { reloadTimeout } from 'src/app/data/service/config.service';
import {
  ConfirmAddDialogModel,
  AddPetitionComponent,
} from 'src/app/modules/accept-petition/dialog/add-petition/add-petition.component';
import {
  ConfirmUpdateDialogModel,
  EditPetitionComponent,
} from 'src/app/modules/accept-petition/dialog/edit-petition/edit-petition.component';
import {
  ConfirmDeleteDialogModel,
  DeletePetitionComponent,
} from 'src/app/modules/accept-petition/dialog/delete-petition/delete-petition.component';
import {
  ConfirmAcceptDialogModel,
  AcceptPetitionComponent,
} from 'src/app/modules/accept-petition/dialog/accept-petition/accept-petition.component';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptPetitionService {
  result: boolean;

  constructor(private main: SnackbarService, private dialog: MatDialog) {}

  addRecord(): void {
    const dialogData = new ConfirmAddDialogModel('Thêm mới phản ánh');
    const dialogRef = this.dialog.open(AddPetitionComponent, {
      width: '80%',
      height: '600px',
      data: dialogData,
      disableClose: true,
    });

    const message = 'Phản ánh';
    const content = '';
    const result = 'được thêm thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe((dialogResult) => {
      const data = dialogResult;
      if (data.data.id != null) {
        const body = JSON.parse(data.body);
        this.main.openSnackBar(
          message,
          body.title,
          result,
          reason,
          'success_notification'
        );
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function () {
          window.location.replace('/tiep-nhan-xu-li/chi-tiet/' + data.data.id);
        }, reloadTimeout);
      }
      if (data.data.id === null) {
        this.main.openSnackBar(
          'Thêm phản ánh',
          content,
          'thất bại',
          reason,
          'error_notification'
        );
      }
    });
  }

  updateRecord(id, name): void {
    const dialogData = new ConfirmUpdateDialogModel('Cập nhật thông báo', id);
    const dialogRef = this.dialog.open(EditPetitionComponent, {
      maxWidth: '80%',
      height: '600px',
      data: dialogData,
      disableClose: true,
    });

    const message = 'Cập nhật phản ánh';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(
          message,
          content,
          result,
          reason,
          'success_notification'
        );
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function () {
          window.location.reload();
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.main.openSnackBar(
          message,
          content,
          'thất bại',
          reason,
          'error_notification'
        );
      }
    });
  }

  deleteRecord(id, name): void {
    const dialogData = new ConfirmDeleteDialogModel('Xoá thông báo', name, id);
    const dialogRef = this.dialog.open(DeletePetitionComponent, {
      width: '800px',
      height: 'auto',
      data: dialogData,
      disableClose: true,
    });

    const message = 'Phản ánh';
    const content = name;
    const result = 'đã được xóa';
    const reason = '';
    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(
          message,
          content,
          result,
          reason,
          'success_notification'
        );
      }
      if (this.result === false) {
        this.main.openSnackBar(
          message,
          content,
          'xóa thất bại',
          reason,
          'error_notification'
        );
      }
    });
  }

  acceptPetition(id, name) {
    const dialogData = new ConfirmAcceptDialogModel(
      'Tiếp nhận phản ánh',
      name,
      id
    );
    const dialogRef = this.dialog.open(AcceptPetitionComponent, {
      width: '800px',
      height: 'auto',
      data: dialogData,
      disableClose: true,
    });
    const message = 'Tiếp nhận phản ánh';
    const content = name;
    const result = ' thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(
          message,
          content,
          result,
          reason,
          'success_notification'
        );
        // tslint:disable-next-line: deprecation
        window.location.reload(true);
      }
      if (this.result === false) {
        this.main.openSnackBar(
          message,
          content,
          'thất bại',
          reason,
          'error_notification'
        );
      }
    });
  }
}
