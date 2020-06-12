import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { FileUploader } from 'ng2-file-upload';

function readBase64(file): Promise<any> {
  const reader = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'load',
      function () {
        resolve(reader.result);
      },
      false
    );

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'error',
      function (event) {
        reject(event);
      },
      false
    );

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-edit-petition',
  templateUrl: './edit-petition.component.html',
  styleUrls: ['./edit-petition.component.scss'],
  providers: [
    { provide: NgxMatDateAdapter, useClass: PickDatetimeAdapter },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: PICK_FORMATS,
    },
  ],
})
export class EditPetitionComponent implements OnInit {
  topicList: string[] = [
    'Giao thông',
    'Y tế',
    'Giáo dục',
    'Môi trường',
    'Cơ sở hạ tầng',
  ];
  agencyList: string[] = [
    'UBND tỉnh Tiền Giang',
    'UBND tỉnh Đồng Tháp',
    'UBND tỉnh Bến Tre',
  ];
  reporterList: string[] = ['Cá nhân', 'Tổ chức'];

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  reporterType = new FormControl('Cá nhân', [
    Validators.required,
    Validators.pattern('Cá nhân'),
  ]);
  xa = new FormControl('Phường 10', [
    Validators.required,
    Validators.pattern('Phường 10'),
  ]);
  huyen = new FormControl('Thành phố Mỹ Tho', [
    Validators.required,
    Validators.pattern('Thành phố Mỹ Tho'),
  ]);
  tinh = new FormControl('Tiền Giang', [
    Validators.required,
    Validators.pattern('Tiền Giang'),
  ]);
  dateApprove = new FormControl(new Date(2019, 11, 19, 15, 30, 0));
  topic = new FormControl(['Giao thông', 'Y tế']);
  agency = new FormControl(['UBND tỉnh Tiền Giang']);

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt'],
  });
  public hasBaseDropZoneOver = false;

  constructor(
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<EditPetitionComponent>
  ) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileSelected(event: any) {
    const file: File = event[0];
    // console.log(file);
    // tslint:disable-next-line:only-arrow-functions
    readBase64(file).then(function (data) {
      // console.log(data);
    });
  }

}
export class ConfirmUpdateDialogModel {
  constructor(public title: string, public id: string) {}
}
