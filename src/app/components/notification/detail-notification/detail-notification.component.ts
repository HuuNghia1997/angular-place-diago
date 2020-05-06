import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { rootURL, notificationHistoryGroupId } from '../../../../environments/environment';

// ====================================================== Services
import { NotificationService } from '../../../services/notification.service';

// ===================================================== Model
import { ImageInfo } from '../../../model/image-info';

@Component({
    selector: 'app-detail-notification',
    templateUrl: './detail-notification.component.html',
    styleUrls: [
        './detail-notification.component.scss',
        '../../../app.component.scss',
        '../list-notification/list-notification.component.scss'
    ]
})
export class DetailNotificationComponent implements OnInit {
    publishURL = rootURL + 'po/notification/';
    notificationId: string;
    groupId = notificationHistoryGroupId;
    pageToGetHistory = 0;
    sizePerPageHistory = 15;
    // Nội dung mặc định
    notificationTitle: string;
    notificationStatus = [];
    notificationAgency = [];
    notificationTags: any;
    notificationCreatedDate: string;
    notificationPublishedDate: string;
    notificationExpiredDate: string;
    notificationContent: string;

    response = [];

    // image
    files = [];

    filesInfo: ImageInfo[] = [];
    uploaded = true;
    // Lịch sử
    history = [];
    activityAccount = 'Nguyễn Văn A';
    dateModified = '24/10/2019 07:00:00';

    result: boolean;
    blankVal: any;


    constructor(
        public dialog: MatDialog,
        private service: NotificationService,
        public snackBar: MatSnackBar,
        private route: ActivatedRoute,
        private http: HttpClient,
    ) { }

    ngOnInit(): void {
        this.notificationId = this.route.snapshot.params.id;
        this.getNotificationDetail();
        this.getNotificationHistory();
    }

    setViewData() {
        this.notificationTitle = this.response[0].title;
        this.notificationStatus.push(this.response[0].publish);
        this.notificationAgency.push(this.response[0].agency);
        this.notificationContent = this.response[0].content;
        this.notificationCreatedDate = this.response[0].createdDate;
        this.notificationPublishedDate = this.response[0].publishedDate;
        this.notificationExpiredDate = this.response[0].expiredDate;
        this.notificationTags = this.response[0].tag;

        if (this.response[0].imageId.length > 0) {
            this.response[0].imageId.forEach(imageId => {

                let urlResult: any;
                let fileName = '';
                let fileNamesFull = '';

                this.service.getImage(imageId).subscribe(data => {
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        urlResult = reader.result;
                        this.service.getImageName_Size(imageId).subscribe((data: any ) => {
                            if (data.filename.length > 20) {
                                // Tên file quá dài
                                const startText = data.filename.substr(0, 5);
                                const shortText = data.filename.substr(data.filename.length - 7, data.filename.length);
                                fileName = startText + '...' + shortText;
                                // Tên file gốc - hiển thị tooltip
                                fileNamesFull = data.filename;
                            } else {
                                fileName = data.filename;
                                fileNamesFull = data.filename;
                            }
                            this.filesInfo.push({
                                id: imageId,
                                url: urlResult,
                                name: fileName,
                                fullName: fileNamesFull
                            });
                        }, err => {
                            console.error(err);
                        });
                    }, false);
                    reader.readAsDataURL(data);
                }, err => {
                    console.error(err);
                });
            });
        }
    }

    getNotificationDetail() {
        this.service.getNotificationDetail(this.notificationId).subscribe(data => {
            this.response.push(data);
            this.setViewData();
        }, err => {
            console.error(err);
            this.service.checkErrorResponse(err, 3);
        });
    }

    getNotificationHistory() {
        // tslint:disable-next-line:max-line-length
        this.service.getNotificationHistory(this.groupId, this.notificationId, this.pageToGetHistory, this.sizePerPageHistory).subscribe(data => {
            const size = data.numberOfElements;
            for (let i = 0; i < size; i++) {
                this.history.push(data.content[i]);
            }
        }, err => {
            console.error(err);
            this.service.checkErrorResponse(err, 4);
        });
    }

    addRecord(): void {
        this.service.addRecord();
    }

    deleteRecord(): void {
        this.service.deleteRecord(this.notificationId, this.notificationTitle);
    }

    updateRecord(): void {
        this.service.updateRecord(this.notificationId, this.notificationTitle);
    }

    sendNotification(): void {
        this.service.sendNotification(this.notificationId, this.notificationTitle);
    }

    // File upload
    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            for (let i = 0; i < filesAmount; i++) {

                let urlResult: any;
                let fileName = '';
                let fileNamesFull = '';

                const reader = new FileReader();
                reader.onload = (eventLoad) => {
                    this.uploaded = true;
                    urlResult = eventLoad.target.result;
                    if (event.target.files[i].name.length > 20) {
                        // Tên file quá dài
                        const startText = event.target.files[i].name.substr(0, 5);
                        const shortText = event.target.files[i].name
                            .substr(event.target.files[i].name.length - 7, event.target.files[i].name.length);
                        fileName = startText + '...' + shortText;
                        // Tên file gốc - hiển thị tooltip
                        fileNamesFull = event.target.files[i].name;
                    } else {
                        fileName = event.target.files[i].name;
                        fileNamesFull = event.target.files[i].name;
                    }
                    this.filesInfo.push({
                        id: i,
                        url: urlResult,
                        name: fileName,
                        fullName: fileNamesFull
                    });
                };
                reader.readAsDataURL(event.target.files[i]);
            }
        }
    }

    // Xoá file
    removeItem(id: string) {
        let counter = 0;
        let index = 0;
        this.filesInfo.forEach(file => {
            if(file.id === id) {
                index = counter;
            }
            counter++;
        });


        this.filesInfo.splice(index, 1);
        this.blankVal = '';
    }
}
