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
import {
  ConfirmAddDialogModel,
  AddProcessComponent
} from 'src/app/modules/config-petition/dialog/add-process/add-process.component';
import { reloadTimeout } from './config.service';
import {
  ConfirmUpdateDialogModel,
  UpdateProcessComponent
} from 'src/app/modules/config-petition/dialog/update-process/update-process.component';
import {
  ConfirmDrawDialogModel,
  DrawProcessComponent
} from 'src/app/modules/config-petition/dialog/draw-process/draw-process.component';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ShowProcessComponent,
  ShowProcessDialogModel
} from 'src/app/modules/config-petition/dialog/show-process/show-process.component';

@Injectable({
  providedIn: 'root'
})
export class ConfigPetitionService {

  result: boolean;

  constructor(private dialog: MatDialog,
              private snackbar: SnackbarService,
              private apiProviderService: ApiProviderService,
              private http: HttpClient) { }
  public searchURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow/--search?';
  public getTagsURL = this.apiProviderService.getUrl('digoMicroservice', 'basecat') + '/tag?category-id=';
  public getDetailURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow/';
  public getHistoryURL = this.apiProviderService.getUrl('digoMicroservice', 'logman') + '/lo'+'/history?group-id=';
  public postURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow';
  public deleteURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow/';
  public putURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow/';
  public updateStatusURL = this.apiProviderService.getUrl('digoMicroservice', 'surfeed') + '/workflow/';
  public getListModelURL = this.apiProviderService.getUrl('digoMicroservice', 'models') + '/projects/';
  public getModelURL = this.apiProviderService.getUrl('digoMicroservice', 'models') + '/models/';
  public putModelUrl = this.apiProviderService.getUrl('digoMicroservice', 'rbPetition') + '/digo/model/';
  public getModelDeployUrl = this.apiProviderService.getUrl('digoMicroservice', 'rbPetition') + '/v1/process-definitions/';
  public getIdModelUrl = this.apiProviderService.getUrl('digoMicroservice', 'rbPetition') + '/v1/process-definitions/';

  search(searchString: string): Observable<any> {
    return this.http.get(this.searchURL + searchString);
  }

  getListTags(id: string): Observable<any> {
    return this.http.get(this.getTagsURL + id);
  }

  getWorkflowDetail(id: string): Observable<any> {
    return this.http.get(this.getDetailURL + id);
  }

  getWorkflowHistory(groupId: number, itemId: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getHistoryURL + groupId + '&item-id=' + itemId + '&page=' + page + '&size=' + size, { headers });
  }

  postWorkflow(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.postURL, requestBody, { headers });
  }

  deleteWorkflow(id: string) {
    return this.http.delete<any>(this.deleteURL + id);
  }

  updateStatus(status, id) {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    formData.append('status', status);
    return this.http.put<any>(this.updateStatusURL + id + '/--apply', formData, { headers });
  }

  updateWorkflow(requestBody, id) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.putURL + id, requestBody, { headers });
  }

  getListModel(projectId, type) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.get<any>(this.getListModelURL + projectId + '/models?type=' + type, { headers });
  }

  getUrlModel(modelId) {
    return this.getModelURL + modelId + '/content';
  }

  deployModel(modelId) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.putModelUrl + modelId + '/--deploy', { headers });
  }

  getModelDeploy(modelIdDeploy) {
    const headers = new HttpHeaders().set('Accept', 'image/svg+xml');
    return this.http.get(this.getModelDeployUrl + modelIdDeploy + '/model', { headers, responseType: 'blob' });
  }

  getIdModel(processDefinitionId) {
    return this.http.get<any>(this.getIdModelUrl + processDefinitionId);
  }

  addProcess(): void {
    const dialogData = new ConfirmAddDialogModel('Thêm mới quy trình');
    const dialogRef = this.dialog.open(AddProcessComponent, {
      width: '80%',
      maxHeight: '600px',
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
        this.snackbar.openSnackBar(message, body.name, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function() {
          window.location.replace('/cau-hinh-phan-anh/chi-tiet/' + data.data.id);
        }, reloadTimeout);
      }
      if (data.data.id === null) {
        this.snackbar.openSnackBar('Thêm quy trình', content, 'thất bại', reason, 'error_notification');
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

  showProcess(id, name): void {
    const dialogData = new ShowProcessDialogModel(name, id);
    const dialogRef = this.dialog.open(ShowProcessComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });
  }

  updateProcess(id, name): void {
    const dialogData = new ConfirmUpdateDialogModel('Cập nhật thông báo', id);
    const dialogRef = this.dialog.open(UpdateProcessComponent, {
      width: '80%',
      maxHeight: '600px',
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
        this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
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
        this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.replace('/cau-hinh-phan-anh');
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
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
        this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.replace('/cau-hinh-phan-anh');
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
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
        this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.replace('/cau-hinh-phan-anh');
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

}
