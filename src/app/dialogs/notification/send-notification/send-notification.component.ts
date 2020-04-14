import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { rootURL } from '../../../../environments/environment';

// ====================================================== Services
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-send-notification',
    templateUrl: './send-notification.component.html',
    styleUrls: ['./send-notification.component.scss', '../../../app.component.scss']
})
export class SendNotificationComponent implements OnInit {
    title: string;
    message: string;
    id: string;
    public publishURL = rootURL + 'po/notification/';

    constructor(
        public dialogRef: MatDialogRef<SendNotificationComponent>,
        private http: HttpClient,
        private service: NotificationService,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmSendDialogModel) {
        this.title = data.title;
        this.message = data.message;
        this.id = data.id;
    }

    ngOnInit(): void {
    }

    onConfirm(): void {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        this.http.put(this.publishURL + this.id + '/--publish', null, { headers }).subscribe(data => {
            this.dialogRef.close(true);
        }, err => {
            console.log(err);
            this.dialogRef.close(false);
        });
    }

    onDismiss(): void {
        this.dialogRef.close();
    }

}
export class ConfirmSendDialogModel {
    constructor(public title: string, public message: string, public id: string) {
    }
}
