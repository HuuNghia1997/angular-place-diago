import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientModule, HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { rootURL, reloadTimeout } from '../../../../environments/environment';

@Component({
    selector: 'app-delete-notification',
    templateUrl: './delete-notification.component.html',
    styleUrls: ['./delete-notification.component.scss', '../../../app.component.scss']
})
export class DeleteNotificationComponent implements OnInit {
    title: string;
    message: string;
    id: string;

    public deleteURL = rootURL + 'po/notification/';

    constructor(public dialogRef: MatDialogRef<DeleteNotificationComponent>,
                private http: HttpClient,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
        this.title = data.title;
        this.message = data.message;
        this.id = data.id;
    }

    ngOnInit(): void {
    }

    onConfirm(id): void {
        const token = localStorage.getItem('auth_token');
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        this.http.delete<any>(this.deleteURL + id, { headers }).subscribe(data => {
            this.dialogRef.close(true);
            setTimeout(function() {
                window.location.replace('/notification');
            }, reloadTimeout);
        }, err => {
            console.log(err);
            this.dialogRef.close(false);
        });
    }

    onDismiss(): void {
        // Close dialog, return false
        this.dialogRef.close();
    }

}
export class ConfirmDialogModel {
    constructor(public title: string, public message: string, public id: string) {
    }
}
