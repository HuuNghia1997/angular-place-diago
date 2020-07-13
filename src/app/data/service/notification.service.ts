import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { reloadTimeout } from 'src/app/data/service/config.service';
import { ListNotificationComponent } from 'src/app/modules/notification/pages/list-notification/list-notification.component';
import { DetailNotificationComponent } from 'src/app/modules/notification/pages/detail-notification/detail-notification.component';
import {
  ConfirmDeleteDialogModel,
  DeleteNotificationComponent
} from 'src/app/modules/notification/dialog/delete-notification/delete-notification.component';
import {
  ConfirmAddDialogModel,
  AddNotificationComponent
} from 'src/app/modules/notification/dialog/add-notification/add-notification.component';
import {
  ConfirmUpdateDialogModel,
  EditNotificationComponent
} from 'src/app/modules/notification/dialog/edit-notification/edit-notification.component';
import {
  ConfirmSendDialogModel,
  SendNotificationComponent
} from 'src/app/modules/notification/dialog/send-notification/send-notification.component';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { SnackbarService } from './snackbar.service';
import { KeycloakService } from 'keycloak-angular';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: HttpClient,
    private main: SnackbarService,
    private dialog: MatDialog,
    private apiProviderService: ApiProviderService,
    private keycloak: KeycloakService,
    private route: ActivatedRoute,
    private router: Router) { }
  public getTags = this.apiProviderService.getUrl('digo-microservice', 'basecat') + '/tag?category-id=';
  public uploadFileURL = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public postURL = this.apiProviderService.getUrl('digo-microservice', 'postman') + '/notification';
  public getDetailURL = this.apiProviderService.getUrl('digo-microservice', 'postman') + '/notification/';
  public putURL = this.apiProviderService.getUrl('digo-microservice', 'postman') + '/notification/';
  public getFileURL = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/';
  public getHistory = this.apiProviderService.getUrl('digo-microservice', 'logman') + '/history?group-id=';
  public searchURL = this.apiProviderService.getUrl('digo-microservice', 'postman') + '/notification/--search?';
  public uploadFilesURL = this.apiProviderService.getUrl('digo-microservice', 'fileman') + '/file/--multiple';
  public getAgencyURL = this.apiProviderService.getUrl('digo-microservice', 'basedata') + '/agency/name+logo-id?parent-id=&tag-id=';
  public getUserURL = this.apiProviderService.getUrl('digo-microservice', 'human') + '/user/--search?keyword=';
  result: boolean;

  private notificationComponent: ListNotificationComponent;
  private detailNotificationComponent: DetailNotificationComponent;

  registerMyApp(myNotification: ListNotificationComponent) {
    this.notificationComponent = myNotification;
  }
  registerDetail(myNotificationDetail: DetailNotificationComponent) {
    this.detailNotificationComponent = myNotificationDetail;
  }

  addRecord(): void {
    const dialogData = new ConfirmAddDialogModel('Thêm mới thông báo');
    const dialogRef = this.dialog.open(AddNotificationComponent, {
      maxWidth: '80%',
      height: '600px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Thông báo';
    const content = '';
    const result = 'được thêm thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      const data = dialogResult;
      if (data.data.id != null) {
        const body = JSON.parse(data.body);
        this.main.openSnackBar(message, body.title, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(() => {
          this.router.navigate(['quan-tri-thong-bao', 'chi-tiet', data.data.id]);
        }, reloadTimeout);
        //this.router.events.subscribe((url: any) => console.log(url));
      }
      if (data.data.id === null) {
        this.main.openSnackBar('Thêm thông báo', content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  testNav() {
    console.log(this.route);
    console.log(this.router);
    this.router.events.subscribe((url: any) => console.log(url));
    console.log(this.router.navigate(['quan-tri-thong-bao', 'chi-tiet', '5f0842c100172a17e0930e26']));
  }

  deleteRecord(id, name): void {
    const dialogData = new ConfirmDeleteDialogModel('Xoá thông báo', name, id);
    const dialogRef = this.dialog.open(DeleteNotificationComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Thông báo';
    const content = name;
    const result = 'đã được xóa';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'xóa thất bại', reason, 'error_notification');
      }
    });
  }

  updateRecord(id, name): void {
    const dialogData = new ConfirmUpdateDialogModel('Cập nhật thông báo', id);
    const dialogRef = this.dialog.open(EditNotificationComponent, {
      maxWidth: '80%',
      height: '600px',
      data: dialogData,
      disableClose: true
    });

    const message = 'Cập nhật thông báo';
    const content = name;
    const result = 'thành công';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line:only-arrow-functions
        setTimeout(() =>{
          //window.location.reload();
          this.router.navigate([this.router.url]);
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      }
    });
  }

  sendNotification(id, name) {
    const dialogData = new ConfirmSendDialogModel('Gửi thông báo', name, id);
    const dialogRef = this.dialog.open(SendNotificationComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true
    });
    const message = 'Thông báo';
    const content = name;
    const result = ' đã được gửi';
    const reason = '';
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.result = dialogResult;
      if (this.result === true) {
        this.main.openSnackBar(message, content, result, reason, 'success_notification');
        // tslint:disable-next-line: deprecation
        setTimeout(() =>{
          //window.location.reload();
          this.router.navigate([this.router.url]);
        }, reloadTimeout);
      }
      if (this.result === false) {
        this.main.openSnackBar(message, content, 'gửi không thành công', reason, 'error_notification');
      }
    });
  }

  getListTags(id: string): Observable<any> {
    return this.http.get(this.getTags + id);
  }

  getNotificationDetail(id: string): Observable<any> {
    return this.http.get(this.getDetailURL + id + '/--full');
  }

  formErrorMessage(id: number) {
    switch (id) {
      case 1:
        return 'Vui lòng nhập tiêu đề thông báo';
      case 2:
        return 'Vui lòng nhập nội dung thông báo';
      case 3:
        return 'Vui lòng chọn đơn vị';
      default:
        return 'You must enter a valid value';
    }
  }

  uploadMultiImages(imgFiles, accountId): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    const formData: FormData = new FormData();
    imgFiles.forEach(img => {
      const file: File = img;
      formData.append('files', file, file.name);
    });
    formData.append('accountId', accountId);
    return this.http.post(this.uploadFilesURL, formData, { headers });
  }

  postNotification(requestBody) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post<any>(this.postURL, requestBody, { headers });
  }

  updateNotification(requestBody, id) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put<any>(this.putURL + id, requestBody, { headers });
  }

  getImage(imageId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileURL + imageId, { headers, responseType: 'blob' });
  }

  getImageName_Size(imageId) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getFileURL + imageId + '/filename+size', { headers });
  }

  getNotificationHistory(groupId: number, itemId: string, page: number, size: number): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get(this.getHistory + groupId + '&item-id=' + itemId + '&page=' + page + '&size=' + size, { headers });
  }

  search(searchString: string): Observable<any> {
    return this.http.get(this.searchURL + searchString);
  }

  getAgency(): Observable<any> {
    return this.http.get(this.getAgencyURL);
  }

  getUser(keywordString: string): Observable<any> {
    return this.http.get(this.getUserURL + keywordString);
  }
}
