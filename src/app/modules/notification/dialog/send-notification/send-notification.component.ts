import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationService } from 'src/app/data/service/notification.service';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';

@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.scss']
})
export class SendNotificationComponent implements OnInit {

  title: string;
  message: string;
  id: string;
  public publishURL = this.apiProviderService.getUrl('digoMicroservice', 'postman') + '/notification/';

  constructor(public dialogRef: MatDialogRef<SendNotificationComponent>,
              private http: HttpClient,
              private service: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmSendDialogModel,
              private apiProviderService: ApiProviderService) {
    this.title = data.title;
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
  }

  onConfirm(): void {
    this.http.put(this.publishURL + this.id + '/--publish', null).subscribe(data => {
      this.dialogRef.close(true);
    }, err => {
      console.error(err);
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
