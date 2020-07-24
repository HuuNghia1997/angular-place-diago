import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { reloadTimeout } from 'src/app/data/service/config.service';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete-notification',
  templateUrl: './delete-notification.component.html',
  styleUrls: ['./delete-notification.component.scss']
})
export class DeleteNotificationComponent implements OnInit {
  title: string;
  message: string;
  id: string;

  public deleteURL = this.apiProviderService.getUrl('digoMicroservice', 'postman') + '/notification/';

  constructor(public dialogRef: MatDialogRef<DeleteNotificationComponent>,
              private http: HttpClient,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogModel,
              private apiProviderService: ApiProviderService,
              private route: ActivatedRoute,
              private router: Router) {
    this.title = data.title;
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
  }

  onConfirm(id): void {
    this.http.delete<any>(this.deleteURL + id).subscribe(data => {
      this.dialogRef.close(true);
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(() => {
        this.router.navigate(['quan-tri-thong-bao']);
      }, reloadTimeout);
    }, err => {
      console.error(err);
      this.dialogRef.close(false);
    });
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

}
export class ConfirmDeleteDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
