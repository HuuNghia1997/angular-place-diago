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
import { ConfirmMapDialogModel, MapComponent } from 'src/app/modules/accept-petition/dialog/map/map.component';
import { CommentDialogModel, CommentComponent } from 'src/app/modules/petition/dialog/comment/comment.component';
import { ConfirmLightboxDialogModel, PreviewLightboxComponent } from 'src/app/modules/petition/dialog/preview-lightbox/preview-lightbox.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PetitionService {
  result: boolean;

  public getTagsUrl = this.apiProviderService.getUrl('digo-microservice', 'basecat') + '/tag?category-id=';
  public getPetitionUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/';
  public getFileUrl = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public deleteFileUrl = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public uploadFilesURL = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/--multiple';
  public processInstanceUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/process-instances/';
  public getHistoryURL = this.apiProviderService.getUrl('digo-microservice', 'logman') + '/history?group-id=';
  public taskUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/tasks/';
  public nextFlowUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/digo/task/';
  public getPlaceUrl = this.apiProviderService.getUrl('digo-microservice', 'basedata') + '/place?nation-id=';
  public commentUrl = this.apiProviderService.getUrl('digo-microservice', 'messenger') + '/comment';
  public taskVariableUrl = this.apiProviderService.getUrl('digo-microservice', 'rb-petition') + '/v1/tasks/';

  constructor(private apiProviderService: ApiProviderService,
              private http: HttpClient,
              private dialog: MatDialog,
              private snackbar: SnackbarService,
              private router: Router) {}

  formErrorMessage(id: number) {
    switch (id) {
      case 1:
        return 'Vui lòng nhập tiêu đề';
      case 2:
        return 'Vui lòng chọn thời gian';
      case 3:
        return 'Vui lòng chọn địa điểm';
      case 4:
        return 'Vui lòng nhập nội dung';
      case 5:
        return 'Vui lòng nhập tên người phản ánh';
      case 6:
        return 'Vui lòng nhập số điện thoại';
      default:
        return 'You must enter a valid value';
    }
  }

  openMapDialog(address, center) {
    const dialogData = new ConfirmMapDialogModel(
      address,
      center.longitude,
      center.latitude
    );
    const dialogRef = this.dialog.open(MapComponent, {
      minWidth: '80%',
      data: dialogData,
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }

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
    return this.http.get<any>(this.getPetitionUrl + '/--with-variables' + '?size=' + size + '&paged=' + paged + '&page=' + page);
  }

  search(page, paged, size, name, place, categoryId, receptionMethodId, fromDate, toDate): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    const query = {
      processVariables: { }
    };
    if (name !== '') {
      const titleObj = {$likeic: '%25' + name + '%25'};
      Object.assign(query.processVariables, {title: titleObj});
    }
    if (place !== '') {
      const placeObj = {$likeic: '%25' + place + '%25'};
      Object.assign(query.processVariables, {takePlaceAddress: placeObj});
    }
    if (categoryId !== '') {
      Object.assign(query.processVariables, {category: categoryId});
    }
    if (receptionMethodId !== '') {
      Object.assign(query.processVariables, {receptionMethod: receptionMethodId});
    }
    if (fromDate !== null && toDate !== null) {
      const creatDateObj = {
        $and: [ { $gte: fromDate }, { $lte: toDate } ]
      };
      Object.assign(query.processVariables, {creatDate: creatDateObj});
    }
    if (fromDate !== null && toDate === null) {
      const creatDateObj = { $gte: fromDate };
      Object.assign(query.processVariables, {creatDate: creatDateObj});
    }
    if (fromDate === null && toDate !== null) {
      const creatDateObj = { $gte: toDate };
      Object.assign(query.processVariables, {creatDate: creatDateObj});
    }
    const body = new HttpParams()
      .set('query', decodeURIComponent(JSON.stringify(query)))
      .set('page', page)
      .set('paged', paged)
      .set('size', size);
    return this.http.get<any>(this.getPetitionUrl + '/--with-variables', { params: body, headers });
  }

  getDetailPetition(taskId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    const query = {
      includeProcessVariables: false,
      includeTaskVariables: true
    };
    const body = new HttpParams().set('query', decodeURIComponent(JSON.stringify(query)));
    return this.http.get<any>(this.getPetitionUrl + taskId + '/--with-variables', { params: body, headers });
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

  deleteFile(fileId: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', '*/*');
    return this.http.delete(this.deleteFileUrl + fileId, { headers });
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
    return this.http.get<any>(this.nextFlowUrl + taskId + '/--check-gateway?level=2');
  }

  // Cập nhật phản ánh & cập nhật kết quả
  postVariable(taskId, requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.taskVariableUrl + taskId + '/variables/petitionData', requestBody, { headers });
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
    return this.http.post<any>(this.uploadFilesURL, formData, { headers });
  }

  postComment(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.commentUrl, requestBody, { headers });
  }

  getComment(groupId, itemId) {
    return this.http.get<any>(this.commentUrl + '?group-id=' + groupId + '&item-id=' + itemId);
  }

  showProcess(processInstanceId, name): void {
    const dialogData = new ShowProcessDialogModel(name, processInstanceId);
    const dialogRef = this.dialog.open(ShowProcessComponent, {
      width: '80%',
      maxHeight: '600px',
      data: dialogData,
      disableClose: false
    });
  }

  comment(petitionId): void {
    const dialogData = new CommentDialogModel('Bình luận', petitionId);
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '50%',
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

  updatePetition(taskId, name): void {
    const dialogData = new ConfirmUpdatePetitionDialogModel('Cập nhật phản ánh', taskId);
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

  updateResult(taskId, name): void {
    const dialogData = new ConfirmUpdateResultDialogModel('Cập nhật phản ánh', taskId);
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

  completePetition(taskId, name): void {
    const dialogData = new ConfirmationCompletedPetitionDialogModel('Xác nhận hoàn thành', taskId);
    const dialogRef = this.dialog.open(ConfirmationCompletedComponent, {
      width: '40%',
      data: dialogData,
      disableClose: true
    });
    const message = 'Xác nhận hoàn thành';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.snackbar.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        if (this.router.url !== '/xu-ly-phan-anh') {
          this.router.navigate(['/xu-ly-phan-anh']);
        } else {
          // tslint:disable-next-line: only-arrow-functions
          setTimeout(function() {
            window.location.reload();
          }, reloadTimeout);
        }
      }
      if (this.result === false) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  openLightbox(fileURL, fileId, listFileUpload, fileName): void {
    const dialogData = new ConfirmLightboxDialogModel(fileURL, fileId, listFileUpload, fileName);
    const dialogRef = this.dialog.open(PreviewLightboxComponent, {
      maxWidth: '100vw',
      width: '100vw',
      height: '100vh',
      data: dialogData,
      disableClose: false,
      panelClass: 'lightbox_dialog'
    });
  }
}
