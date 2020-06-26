import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
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
import {
  ConfirmCommentDialogModel,
  CommentPetitionComponent,
} from 'src/app/modules/accept-petition/dialog/comment-petition/comment-petition.component';
import { SnackbarService } from './snackbar.service';
import { query } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class AcceptPetitionService {
  result: boolean;

  constructor(
    private http: HttpClient,
    private main: SnackbarService,
    private dialog: MatDialog,
    private apiProviderService: ApiProviderService,
    private keycloak: KeycloakService
  ) {}

  // Connect API
  public getTags =
    this.apiProviderService.getUrl('digo-microservice', 'basecat') +
    '/tag?category-id=';
  public getAgencyURL =
    this.apiProviderService.getUrl('digo-microservice', 'basedata') +
    '/agency/name+logo-id?parent-id=&tag-id=';
  public searchURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed') +
    '/petition/--search?';
  public postURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed') +
    '/petition';
  public uploadFilesURL =
    this.apiProviderService.getUrl('digo-microservice', 'fileman') +
    '/file/--multiple';
  public getDetailURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed') +
    '/petition/';
  public putURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed') +
    '/petition/';
  public getFileURL =
    this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public getHistory =
    this.apiProviderService.getUrl('digo-microservice', 'logman') +
    '/history?group-id=';
  public getUserURL =
    this.apiProviderService.getUrl('digo-microservice', 'human') +
    '/user/--search?keyword=';
  public getWorkflowURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed') +
    '/workflow/--apply?tag=';
  public getPlaceURL =
    this.apiProviderService.getUrl('digo-microservice-basedata', 'basedata') +
    '/place?nation-id=';
  public postProcessInstancesURL =
    this.apiProviderService.getUrl('digo-microservice', 'surfeed-rb-petition') +
    '/v1/process-instances';
  public getComment =
    this.apiProviderService.getUrl('digo-microservice-basedata', 'messenger') +
    '/comment?group-id=';
  public postCommentURL =
    this.apiProviderService.getUrl('digo-microservice-basedata', 'messenger') +
    '/comment';

  // Lấy danh sách chuyên mục phản ánh
  getListTag(id: string): Observable<any> {
    return this.http.get(this.getTags + id);
  }

  // Lấy danh sách đơn vị phản ánh
  getAgency(): Observable<any> {
    return this.http.get(this.getAgencyURL);
  }

  // Tìm kiếm danh sách phản ánh
  search(searchString: string): Observable<any> {
    return this.http.get(this.searchURL + searchString);
  }

  // Thêm mới phản ánh
  postPetition(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.postURL, requestBody, { headers });
  }

  // Detail petition
  getPetitionDetail(id: string): Observable<any> {
    return this.http.get(this.getDetailURL + id);
  }

  // Lấy danh sách quy trình phản ánh
  getWorkflow(tagId: number): Observable<any> {
    return this.http.get(this.getWorkflowURL + tagId);
  }

  uploadMultiImages(imgFiles, accountId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    imgFiles.forEach((img) => {
      const file: File = img;
      formData.append('files', file, file.name);
    });
    formData.append('accountId', accountId);
    return this.http.post(this.uploadFilesURL, formData, { headers });
  }

  // Cập nhật phản ánh
  updatePetition(requestBody, id) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.putURL + id, requestBody, { headers });
  }

  // Tiếp nhận phản ánh
  acceptPetition(requestBody, id) {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    formData.append('workflowId', requestBody.workflowId);
    formData.append('workflowName', requestBody.workflowName);
    formData.append('processDefinitionId', requestBody.processDefinitionId);
    formData.append('sendSms', requestBody.sendSms);
    formData.append('isPublic', requestBody.isPublic);
    return this.http.put<any>(this.putURL + id + '/--start-process', formData, {
      headers,
    });
  }

  // Hủy tiếp nhận phản ánh
  cancelPetition(requestBody, id) {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    formData.append('content', requestBody.content);
    formData.append('agencyId', requestBody.agencyId);
    formData.append('agencyName', requestBody.agencyName);
    formData.append('sendSms', requestBody.sendSms);
    formData.append('isPublic', requestBody.isPublic);
    return this.http.put<any>(this.putURL + id + '/--cancel', formData, {
      headers,
    });
  }

  // Thêm bình luận
  addCommentPetition(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.postCommentURL, requestBody, { headers });
    console.log('ok');
  }

  getImage(imageId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileURL + imageId, {
      headers,
      responseType: 'blob',
    });
  }

  getImageName_Size(imageId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileURL + imageId + '/filename+size', {
      headers,
    });
  }

  // Lấy bình luận
  getPetitionComment(
    groupId: number,
    itemId: string,
    page: number,
    size: number
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(
      this.getComment +
        groupId +
        '&item-id=' +
        itemId +
        '&page=' +
        page +
        '&size=' +
        size,
      { headers }
    );
  }

  // Lấy lịch sử
  getPetitionHistory(
    groupId: number,
    itemId: string,
    page: number,
    size: number
  ): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(
      this.getHistory +
        groupId +
        '&item-id=' +
        itemId +
        '&page=' +
        page +
        '&size=' +
        size,
      { headers }
    );
  }

  getUser(keywordString: string): Observable<any> {
    return this.http.get(this.getUserURL + keywordString);
  }

  // Lấy tỉnh
  getPlace(nationId: number, parentTypeId: number): Observable<any> {
    return this.http.get(
      this.getPlaceURL + nationId + '&parent-type-id=' + parentTypeId
    );
  }

  // Lấy huyện hoặc xã theo parentTypeId
  getPlaceTown(
    nationId: number,
    parentTypeId: number,
    parentId: number
  ): Observable<any> {
    return this.http.get(
      this.getPlaceURL +
        nationId +
        '&parent-type-id=' +
        parentTypeId +
        '&parent-id=' +
        parentId
    );
  }

  // Thêm mới tiến trình
  postProcessInstances(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.postProcessInstancesURL, requestBody, {
      headers,
    });
    console.log('ok');
  }

  // Dialog
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
        window.location.replace('/tiep-nhan-phan-anh/chi-tiet/' + data.data.id);
      }
      if (data.data.id === null) {
        this.main.openSnackBar(
          'Thêm thông báo',
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
    const dialogData = new ConfirmDeleteDialogModel('Hủy phản ánh', name, id);
    const dialogRef = this.dialog.open(DeletePetitionComponent, {
      width: '800px',
      height: 'auto',
      data: dialogData,
      disableClose: true,
    });

    const message = 'Phản ánh';
    const content = name;
    const result = 'đã hủy tiếp nhận';
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
        window.location.reload(true);
      }
      if (this.result === false) {
        this.main.openSnackBar(
          message,
          content,
          'hủy thất bại',
          reason,
          'error_notification'
        );
      }
    });
  }

  acceptPetitionDialog(id, name) {
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

  addComment(id, name): void {
    const dialogData = new ConfirmCommentDialogModel('Thêm bình luận', id);
    const dialogRef = this.dialog.open(CommentPetitionComponent, {
      maxWidth: '80%',
      minWidth: '60%',
      data: dialogData,
      disableClose: true,
    });

    const message = 'Bình luận phản ánh';
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

  formErrorMessage(id: number) {
    switch (id) {
      case 1:
        return 'Vui lòng nhập tên người phản ánh';
      case 2:
        return 'Vui lòng nhập số điện thoại';
      case 3:
        return 'Vui lòng nhập tiêu đề';
      case 4:
        return 'Vui lòng chọn chuyên mục';
      case 5:
        return 'Vui lòng chọn thời gian xảy ra';
      case 6:
        return 'Vui lòng chọn đơn vị phản ánh';
      case 7:
        return 'Vui lòng nhập nội dung phản ánh';
      case 8:
        return 'Vui lòng nhập địa điểm phản ánh';
      case 9:
        return 'Vui lòng chọn quy trình phản ánh';
      default:
        return 'You must enter a valid value';
    }
  }
}
