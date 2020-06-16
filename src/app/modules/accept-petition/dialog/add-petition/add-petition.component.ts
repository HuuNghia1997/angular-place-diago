import { Component, OnInit, ViewChild } from '@angular/core';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-add-petition',
  templateUrl: './add-petition.component.html',
  styleUrls: ['./add-petition.component.scss'],
  providers: [
    { provide: NgxMatDateAdapter, useClass: PickDatetimeAdapter },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: PICK_FORMATS,
    },
  ],
})
export class AddPetitionComponent implements OnInit {
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

  uploaded: boolean;
  blankVal: any;
  uploadedImage = [];
  listTags = [];
  itemsListTags = [];
  files = [];
  urls = [];
  fileNames = [];
  fileNamesFull = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  constructor(
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<AddPetitionComponent>,
    private imageCompress: NgxImageCompressService,
    private main: SnackbarService
  ) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  resetForm(): void {
    this.urls = [];
    this.fileNames = [];
    this.fileNamesFull = [];
    this.uploaded = false;
  }

  // File upload
  onSelectFile(event) {
    let i = 0;
    if (event.target.files && event.target.files[0]) {
      for (const file of event.target.files) {
        let urlNone: any;
        const reader = new FileReader();
        reader.onload = (eventLoad) => {
          this.uploaded = true;
          urlNone = eventLoad.target.result;
          this.imageCompress
            .compressFile(urlNone, -1, 75, 50)
            .then((result) => {
              this.urlPreview = result;
              this.fileImport = this.convertBase64toFile(
                this.urlPreview,
                file.name
              );
              if (this.urls.length + 1 <= 5) {
                this.urls.push(this.urlPreview);
                this.files.push(this.fileImport);
                if (this.fileImport.name.length > 20) {
                  // Tên file quá dài
                  const startText = event.target.files[i].name.substr(0, 5);
                  // tslint:disable-next-line:max-line-length
                  const shortText = event.target.files[i].name.substring(
                    event.target.files[i].name.length - 7,
                    event.target.files[i].name.length
                  );
                  this.fileNames.push(startText + '...' + shortText);
                  // Tên file gốc - hiển thị tooltip
                  this.fileNamesFull.push(event.target.files[i].name);
                } else {
                  this.fileNames.push(this.fileImport.name);
                  this.fileNamesFull.push(this.fileImport.name);
                }
              } else {
                this.main.openSnackBar(
                  'Số lượng ',
                  'hình ảnh ',
                  'không được vượt quá ',
                  '5',
                  'error_notification'
                );
              }
            });
        };
        reader.readAsDataURL(event.target.files[i]);
        i++;
      }
    }
  }

  dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpg' });
    return blob;
  }

  convertBase64toFile(base64, fileName) {
    const date = new Date().valueOf();
    const imageName = date + '.jpg';
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], fileName, { type: 'image/jpg' });
    return imageFile;
  }

  // Xoá file
  removeItem(index: number) {
    this.urls.splice(index, 1);
    this.fileNames.splice(index, 1);
    this.fileNamesFull.splice(index, 1);
    this.files.splice(index, 1);
    this.blankVal = '';
  }
}

export class ConfirmAddDialogModel {
  constructor(public title: string) {}
}
