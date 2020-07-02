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
import { ConfirmUpdateResultDialogModel, UpdateResultComponent } from 'src/app/modules/petition/dialog/update-result/update-result.component';
import { title } from 'process';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { CommentDialogModel, CommentComponent } from 'src/app/modules/petition/dialog/comment/comment.component';

@Injectable({
  providedIn: 'root'
})
export class PetitionService {
  result: boolean;

  public getTagsUrl = this.apiProviderService.getUrl('digo-microservice', 'basecat') + '/tag?category-id=';
  public getPetitionUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/--with-variables';
  public getFileUrl = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public uploadFilesURL = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/--multiple';
  public processInstanceUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/process-instances/';
  public getHistoryURL = this.apiProviderService.getUrl('digo-microservice', 'logman') + '/history?group-id=';
  public taskUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/tasks/';
  public nextFlowUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/';
  public getPlaceUrl = this.apiProviderService.getUrl('digo-microservice', 'basedata') + '/place?nation-id=';
  public commentUrl = this.apiProviderService.getUrl('digo-microservice', 'message') + '/comment';

  constructor(private apiProviderService: ApiProviderService,
              private http: HttpClient,
              private dialog: MatDialog,
              private snackbar: SnackbarService) { }

  getListTag(categoryId): Observable<any> {
    return this.http.get(this.getTagsUrl + categoryId);
  }

  getProvince(nationId, provinceTypeId) {
    return this.http.get<any>(this.getPlaceUrl + nationId + '&parent-type-id=' + provinceTypeId);
  }

  getDistrict(nationId, districtTypeId, provinceId) {
    return this.http.get<any>(this.getPlaceUrl + nationId + '&parent-type-id=' + districtTypeId + '&parent-id=' + provinceId);
  }

  getPetitionList(page, size, paged): Observable<any> {
    return this.http.get<any>(this.getPetitionUrl + '?size=' + size + '&paged=' + paged + '&page=' + page);
  }

  search(page, paged, size, name, place, categoryId, receptionMethodId, fromDate, toDate): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    const query = {
      processVariables:
      {
        title: {
          $likeic: '%25' + name + '%25'
        },
        takePlaceAddress: {
          $likeic: '%25' + place + '%25'
        },
        category: categoryId,
        receptionMethod: receptionMethodId,
        creatDate: {
          $and: [
            {
              $gte: fromDate
            },
            {
              $lte: toDate
            }
          ]
        }
      }
    };
    console.log(JSON.stringify(query));
    const body = new HttpParams().set('query', decodeURIComponent(JSON.stringify(query)))
                                .set('page', page)
                                .set('paged', paged)
                                .set('size', size);
    // console.log(this.getPetitionUrl, { params: body, headers });
    return this.http.get<any>(this.getPetitionUrl, { params: body, headers });
  }

  getDetailPetition(id): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    const query = {
      processVariables:
      {
        petitionId: id
      }
    };
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
    return this.http.get(this.processInstanceUrl + processInstanceId + '/model', { headers, responseType: 'blob' });
  }

  getHistory(groupId: number, itemId: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getHistoryURL + groupId + '&item-id=' + itemId + '&page=' + page + '&size=' + size, { headers });
  }

  getNextFlow(taskId) {
    return this.http.get<any>(this.nextFlowUrl + taskId + '/--check-gateway');
  }

  // Cập nhật phản ánh & cập nhật kết quả
  postVariable(processInstancesId, requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.processInstanceUrl + processInstancesId + '/variables', requestBody, { headers });
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

  uploadMultiImages(imgFiles, accountId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    imgFiles.forEach(files => {
        const file: File = files;
        formData.append('files', file, file.name);
    });
    formData.append('accountId', accountId);
    return this.http.post(this.uploadFilesURL, formData, { headers });
  }

  postComment(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.commentUrl, requestBody, { headers });
  }

  getComment(groupId, itemId) {
    return this.http.get<any>(this.commentUrl + '?group-id=' + groupId + '&item-id=' + itemId);
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

  comment(id): void {
    const dialogData = new CommentDialogModel('Bình luận', id);
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '80%',
      maxHeight: '600px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Bình luận';
    const content = '';
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

  updateResult(id, name): void {
    const dialogData = new ConfirmUpdateResultDialogModel('Cập nhật phản ánh', id);
    const dialogRef = this.dialog.open(UpdateResultComponent, {
      width: '80%',
      maxHeight: '600px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Cập nhật kết quả';
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
