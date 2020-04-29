import { Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MainService } from './main.service';
import { MatDialog } from '@angular/material/dialog';
import { rootURL, reloadTimeout, pageSizeOptions } from '../../environments/environment';
import { OauthService } from './oauth.service';

// ====================================================== Component
import { ConfirmDialogModel, DeleteNotificationComponent } from '../dialogs/notification/delete-notification/delete-notification.component';
import { ConfirmAddDialogModel, AddNotificationComponent } from '../dialogs/notification/add-notification/add-notification.component';
import { ConfirmUpdateDialogModel, EditNotificationComponent } from '../dialogs/notification/edit-notification/edit-notification.component';
import { ConfirmSendDialogModel, SendNotificationComponent } from '../dialogs/notification/send-notification/send-notification.component';

import { ListNotificationComponent } from '../components/notification/list-notification/list-notification.component';
import { DetailNotificationComponent } from '../components/notification/detail-notification/detail-notification.component';

export interface PeriodicElement {
    id: number;
    stt: number;
    title: string;
    agency: string;
    catalogy: string;
    createdAt: string;
    status: string;
    endDate: string;
}

@Injectable()
export class NotificationService {

    constructor(
        private http: HttpClient,
        private main: MainService,
        private dialog: MatDialog,
        private auth: OauthService
    ) { }
    public getTags = rootURL + 'bt/tag?category-id=';
    public uploadFileURL = rootURL + 'fi/file/';
    public postURL = rootURL + 'po/notification';
    public getDetailURL = rootURL + 'po/notification/';
    public putURL = rootURL + 'po/notification/';
    public getFileURL = rootURL + 'fi/file/';
    public getHistory = rootURL + 'lo/history?group-id=';
    public searchURL = rootURL + 'po/notification/--search?';
    public uploadFilesURL = rootURL + 'fi/file/--multiple';

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
            maxWidth: '60%',
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
            if (data.id != null) {
                this.main.openSnackBar(message, content, result, reason, 'success_notification');
                // tslint:disable-next-line:only-arrow-functions
                setTimeout(function() {
                    window.location.replace('/notification/detail/' + data.id);
                }, reloadTimeout);
            }
            if (data.id === null) {
                this.main.openSnackBar('Thêm thông báo', content, 'thất bại', reason, 'error_notification');
            }
        });
    }

    deleteRecord(id, name): void {
        const dialogData = new ConfirmDialogModel('Xoá thông báo', name, id);
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
            maxWidth: '60%',
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
                setTimeout(function() {
                    window.location.reload();
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
        const result = 'gửi thành công';
        const reason = '';
        dialogRef.afterClosed().subscribe(dialogResult => {
            this.result = dialogResult;
            if (this.result === true) {
                this.main.openSnackBar(message, content, result, reason, 'success_notification');
            }
            if (this.result === false) {
                this.main.openSnackBar(message, content, 'gửi không thành công', reason, 'error_notification');
            }
        });
    }

    checkErrorResponse(error: HttpErrorResponse, type: number) {
        console.log('run error hander');
        console.log(error.status);
        if (error.status === 401) {
            console.log('refresh');
            console.log(type);
            this.auth.refeshToken((result) => {
                if (result) {
                    console.log('call back ' + result);
                    switch (type) {
                        case 1:
                            this.notificationComponent.search(0, pageSizeOptions);
                            break;
                        case 2:
                            this.notificationComponent.getListTags();
                            break;
                        case 3:
                            this.detailNotificationComponent.getNotificationDetail();
                            break;
                        case 4:
                            this.detailNotificationComponent.getNotificationHistory();
                            break;
                    }
                }
            });
        }
    }

    getListTags(id: string): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getTags + id, { headers }).pipe();
    }

    getNotificationDetail(id: string): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getDetailURL + id + '/--full', { headers }).pipe();
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

    uploadImages(imgFile, accountId): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        // headers = headers.append('Content-Type', 'multipart/form-data');
        headers = headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        const formData: FormData = new FormData();
        const file: File = imgFile;
        formData.append('file', file, file.name);
        // formData.append('accountId', accountId);

        return this.http.post(this.uploadFileURL, formData, { headers }).pipe();
    }

    uploadMultiImages(imgFiles, accountId): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        // headers = headers.append('Content-Type', 'multipart/form-data');
        headers = headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        const formData: FormData = new FormData();
        imgFiles.forEach(img => {
            const file: File = img;
            formData.append('files', file, file.name);
        });
        // formData.append('accountId', accountId);

        return this.http.post(this.uploadFilesURL, formData, { headers }).pipe();
    }

    postNotification(requestBody) {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.post<any>(this.postURL, requestBody, { headers }).pipe();
    }

    updateNotification(requestBody, id) {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.put<any>(this.putURL + id, requestBody, { headers }).pipe();
    }

    getImage(imageId) {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getFileURL + imageId, { headers, responseType: 'blob' }).pipe();
    }

    getImageName_Size(imageId) {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getFileURL + imageId + '/filename+size', { headers }).pipe();
    }

    getNotificationHistory(groupId: number, itemId: string, page: number, size: number): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.getHistory + groupId + '&item-id=' + itemId + '&page=' + page + '&size=' + size, { headers }).pipe();
    }

    search(searchString: string): Observable<any> {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        return this.http.get(this.searchURL + searchString, { headers }).pipe();
    }
}
