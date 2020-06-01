import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/data/service/notification.service';
import { PopupService } from 'src/app/data/service/popup.service';
import { PICK_FORMATS, notificationCategoryId } from 'src/app/data/service/config.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class AddNotificationComponent implements OnInit {
  popupTitle: string;
  uploaded: boolean;
  blankVal: any;
  categoryId = notificationCategoryId;
  accountId: string;

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
  agencyList: AgencyInfo[] = [];

  // Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  addForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    agency: new FormControl(''),
    tag: new FormControl(''),
    expiredDate: new FormControl(''),
    publish: new FormControl(''),
  });
  title = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  content = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  agency = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  constructor(public dialogRef: MatDialogRef<AddNotificationComponent>,
              private service: NotificationService,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmAddDialogModel,
              public datepipe: DatePipe,
              private imageCompress: NgxImageCompressService,
              private main: PopupService) {
    this.popupTitle = data.title;
    this.accountId = localStorage.getItem('USER_INFO_ID');
  }

  ngOnInit(): void {
    this.getListTags();
    this.getAgency();
  }

  public getListTags() {
    this.service.getListTags(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      // this.service.checkErrorResponse(err, 2);
      console.log(err);
    });
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  onConfirm(): void {
    if (this.files.length > 0) {
      this.service.uploadMultiImages(this.files, this.accountId).subscribe((data: any) => {
        data.forEach(imgInfo => {
          this.uploadedImage.push(imgInfo.id);
        });
        this.formToJSON();
      }, (error) => {
        console.error(error);
      });
    } else {
      this.formToJSON();
    }
  }

  getAgency() {
    this.service.getAgency().subscribe(data => {
      this.agencyList = data.content;
    });
  }

  formToJSON() {
    const formObj = this.addForm.getRawValue();
    let newPublishedDate: string;

    // Format publish
    if (formObj.publish) {
      formObj.publish = 1;
      newPublishedDate = new Date().toString();
      formObj.publishedDate = this.datepipe.transform(newPublishedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    } else {
      formObj.publish = 0;
      formObj.publishedDate = this.datepipe.transform(newPublishedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    }

    // Format expiredDate
    formObj.expiredDate = this.datepipe.transform(formObj.expiredDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

    // Add agency
    const selectedAgency = formObj.agency;
    formObj.agency = this.agencyList.find(p => p.id == selectedAgency);

    // Add Tags
    for (const i of formObj.tag) {
      // tslint:disable-next-line: triple-equals
      const item = this.listTags.find(p => p.id == i);
      this.itemsListTags.push(item);
    }
    this.itemsListTags = this.itemsListTags.map(item => {
      delete item.parentId;
      delete item.orderNumber;
      delete item.status;
      delete item.createdDate;
      delete item.description;
      return item;
    });
    formObj.tag = this.itemsListTags;
    // Add Image
    formObj.imageId = this.uploadedImage;

    // Final result
    const resultJson = JSON.stringify(formObj, null, 2);
    this.postNotification(resultJson);
  }

  postNotification(requestBody) {
    this.service.postNotification(requestBody).subscribe(data => {
      // Close dialog, return true
      let result = {
        body: requestBody,
        data: data
      }
      this.dialogRef.close(result);
    }, err => {
      // Close dialog, return false
      this.dialogRef.close(false);
      // Call api delete file
    });
  }

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
          this.imageCompress.compressFile(urlNone, -1, 75, 50).then(result => {
            this.urlPreview = result;
            this.fileImport = this.convertBase64toFile(this.urlPreview, file.name);
            if (this.urls.length + 1 <= 5) {
              this.urls.push(this.urlPreview);
              this.files.push(this.fileImport);
              if (this.fileImport.name.length > 20) {
                // Tên file quá dài
                const startText = event.target.files[i].name.substr(0, 5);
                // tslint:disable-next-line:max-line-length
                const shortText = event.target.files[i].name.substring(event.target.files[i].name.length - 7,
                                                                      event.target.files[i].name.length);
                this.fileNames.push(startText + '...' + shortText);
                // Tên file gốc - hiển thị tooltip
                this.fileNamesFull.push(event.target.files[i].name);
              } else {
                this.fileNames.push(this.fileImport.name);
                this.fileNamesFull.push(this.fileImport.name);
              }
            } else {
              this.main.openSnackBar('Số lượng ', 'hình ảnh ', 'không được vượt quá ', '5', 'error_notification');
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
