import { Injectable } from '@angular/core';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShowProcessDialogModel, ShowProcessComponent } from 'src/app/modules/petition/dialog/show-process/show-process.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmUpdatePetitionDialogModel,
  UpdatePetitionComponent
} from 'src/app/modules/petition/dialog/update-petition/update-petition.component';
import { reloadTimeout } from './config.service';
import { SnackbarService } from './snackbar.service';
import { ConfirmationCompletedPetitionDialogModel, ConfirmationCompletedComponent } from 'src/app/modules/petition/dialog/confirmation-completed/confirmation-completed.component';

@Injectable({
  providedIn: 'root'
})
export class PetitionService {
  result: boolean;

  public getTagsUrl = this.apiProviderService.getUrl('digo-microservice', 'basecat') + '/tag?category-id=';
  public getPetitionUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/--with-variables';
  public getFileUrl = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public getModelUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/process-instances/';
  public getHistoryURL = this.apiProviderService.getUrl('digo-microservice', 'logman') + '/history?group-id=';
  public taskUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/tasks/';
  public nextFlowUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/';
  public setVariablesUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/process-instances/';

  constructor(private apiProviderService: ApiProviderService,
              private http: HttpClient,
              private dialog: MatDialog,
              private snackbar: SnackbarService) { }

  getListTag(categoryId): Observable<any> {
    return this.http.get(this.getTagsUrl + categoryId);
  }

  getPetitionList(): Observable<any> {
    return this.http.get<any>(this.getPetitionUrl);
  }

  getDetailPetition(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    const query = { processVariables: { petitionId: id }};
    const body = new HttpParams().set('query', decodeURIComponent(JSON.stringify(query)));
    return this.http.get<any>(this.getPetitionUrl, { params: body, headers });
  }

  getFile(fileId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileUrl + fileId, { headers, responseType: 'blob' });
  }

  getFileName_Size(fileId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileUrl + fileId + '/filename+size', { headers });
  }

  getModel(processInstanceId) {
    const headers = new HttpHeaders().set('Accept', 'image/svg+xml');
    return this.http.get(this.getModelUrl + processInstanceId + '/model', { headers, responseType: 'blob' });
  }

  getHistory(groupId: number, itemId: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getHistoryURL + groupId + '&item-id=' + itemId + '&page=' + page + '&size=' + size, { headers });
  }

  getNextFlow(taskId) {
    return this.http.get<any>(this.nextFlowUrl + taskId + '/--next-flow-element?level=2');
  }

  postVariable(processInstancesId, requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.setVariablesUrl + processInstancesId + '/variables', requestBody, { headers });
  }

  completeTask(taskId, requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.taskUrl + taskId + '/complete', requestBody, { headers });
  }

  claimTask(taskId) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.taskUrl + taskId + '/claim', { headers });
  }

  releaseTask(taskId) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.taskUrl + taskId + '/release', { headers });
  }

  showProcess(id, name): void {
    const dialogData = new ShowProcessDialogModel(name, id);
    const dialogRef = this.dialog.open(ShowProcessComponent, {
      width: '80%',
      maxHeight: '600px',
      data: dialogData,
      disableClose: true
    });
  }

  updatePetition(id, name): void {
    const dialogData = new ConfirmUpdatePetitionDialogModel('Cập nhật phản ánh', id);
    const dialogRef = this.dialog.open(UpdatePetitionComponent, {
      width: '80%',
      maxHeight: '600px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Cập nhật phản ánh';
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

  completePetition(id, name): void {
    const dialogData = new ConfirmationCompletedPetitionDialogModel('Xác nhận hoàn thành', id);
    const dialogRef = this.dialog.open(ConfirmationCompletedComponent, {
      width: '80%',
      data: dialogData,
      disableClose: true
    });

    // const message = 'Xác nhận hoàn thành';
    // const content = name;
    // const result = 'thành công';
    // const reason = '';
    // dialogRef.afterClosed().subscribe(dialogResult => {
    //   this.result = dialogResult;
    //   if (this.result === true) {
    //     this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
    //     // tslint:disable-next-line:only-arrow-functions
    //     setTimeout(function() {
    //       window.location.reload();
    //     }, reloadTimeout);
    //   }
    //   if (this.result === false) {
    //     this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
    //   }
    // });
  }
}
