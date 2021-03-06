import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/data/service/notification.service';
import { PICK_FORMATS, notificationCategoryId } from 'src/app/data/service/config.service';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import { NgxImageCompressService } from 'ngx-image-compress';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { KeycloakService } from 'keycloak-angular';
import { User } from 'src/app/data/schema/user';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-notification',
  templateUrl: './edit-notification.component.html',
  styleUrls: ['./edit-notification.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class EditNotificationComponent implements OnInit {
  popupTitle: string;
  uploaded: boolean;
  blankVal: any;
  notificationId: string;
  categoryId = notificationCategoryId;
  accountId: string;
  username: string;

  uploadedImage = [];
  countDefaultImage;
  listTags = [];
  itemsListTags = [];
  files = [];
  filesInfo: ImageInfo[] = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;
  agencyList: AgencyInfo[] = [];
  userList: User[] = [];
  userSearch: User[] = [];
  itemsListUsers = [];
  response = [];
  keyword: '';
  progress: number = 0;
  updateImageProgress: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditNotificationComponent>,
              private service: NotificationService,
              public datepipe: DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateDialogModel,
              private imageCompress: NgxImageCompressService,
              private main: SnackbarService,
              private keycloak: KeycloakService) {
    this.popupTitle = data.title;
    this.notificationId = data.id;
  }

  // Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  updateForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
    agency: new FormControl(''),
    tag: new FormControl(''),
    expiredDate: new FormControl(''),
    publish: new FormControl(''),
    to: new FormControl('')
  });
  title = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  content = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  agency = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  getAgency() {
    this.service.getAgency().subscribe(data => {
      this.agencyList = data.content;
      for (let i = 0; i < data.content.length; i++) {
        this.agencyList[i].imageId = data.content[i].logoId;
      }
    });
  }

  getUser() {
    this.service.getUser('').subscribe(data => {
      this.userList = data.content;
      for (let i = 0; i < data.content.length; i++) {
        this.userList[i].userId = data.content[i].id;
      }
    });
  }

  initUserSearch() {
    this.service.getUser('').subscribe(data => {
      this.userSearch = [];
      for (let i = 0; i < data.content.length; i++) {
        data.content[i].userId = data.content[i].id;
        if (!this.checkUserListContain(data.content[i].id)) {
          this.userSearch.push(data.content[i]);
        }
      }
    });
  }

  resetform() {
    this.service.getUser('').subscribe(data => {
      this.userSearch = [];
      for (let i = 0; i < data.content.length; i++) {
        data.content[i].userId = data.content[i].id;
        if (!this.checkUserListContain(data.content[i].id)) {
          this.userSearch.push(data.content[i]);
        }
      }
    });
  }

  checkUserListContain(id: string): boolean {
    for (const i of this.userList) {
      if (i.id === id) return true;
    }
    return false;
  }

  onSelectTo(event: any) {
    for (const i of event) {
      const item = this.userSearch.find(p => p.id == i);
      const index: number = this.userSearch.indexOf(item);
      if (index !== -1) {
        this.userSearch.splice(index, 1);
      }
      if (item) {
        if (this.userList.indexOf(item) < 0) {
          this.userList.push(item);
        }
      }
    }
  }

  onInput(event: any) {
    this.keyword = event.target.value;
    this.service.getUser(this.keyword).subscribe(data => {
      this.userSearch = [];
      for (let i = 0; i < data.content.length; i++) {
        data.content[i].userId = data.content[i].id;
        if (!this.checkUserListContain(data.content[i].id)) {
          this.userSearch.push(data.content[i]);
        }
      }
    });
  }

  onConfirm(): void {
    // this.keycloak.loadUserProfile().then(user => {
    //   // tslint:disable-next-line: no-string-literal
    //   this.accountId = user['attributes'].user_id;
    //   this.countDefaultImage = this.uploadedImage.length;
    //   if (this.countDefaultImage > 0) {
    //     if (this.files.length > 0) {
    //         this.service.uploadMultiImages(this.files, this.accountId).subscribe((data) => {
    //           data.forEach(imgInfo => {
    //             this.uploadedImage.push(imgInfo.id);
    //           });
    //           this.formToJSON();
    //         });
    //       // });
    //     } else {
    //       this.formToJSON();
    //     }
    //   } else {
    //     if (this.files.length > 0) {
    //       this.service.uploadMultiImages(this.files, this.accountId).subscribe((data) => {
    //         data.forEach(imgInfo => {
    //           this.uploadedImage.push(imgInfo.id);
    //         });
    //         this.formToJSON();
    //       });
    //     } else {
    //       this.formToJSON();
    //     }
    //   }
    // });
    this.formToJSON();
  }

  formToJSON() {
    const formObj = this.updateForm.getRawValue();
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

    // Add user
    for (const i of formObj.to) {
      // tslint:disable-next-line: triple-equals
      const item = this.userList.find(p => p.id == i);
      this.itemsListUsers.push(item);
    }
    this.itemsListUsers = this.itemsListUsers.map(item => {
      delete item.parentId;
      delete item.orderNumber;
      delete item.status;
      delete item.createdDate;
      delete item.description;
      return item;
    });
    formObj.to = this.itemsListUsers;
    // Add Image
    formObj.imageId = this.uploadedImage;
    // Final result
    const resultJson = JSON.stringify(formObj, null, 2);
    this.updateNotification(resultJson);
  }

  updateNotification(requestBody) {
    this.service.updateNotification(requestBody, this.notificationId).subscribe(data => {
      // Close dialog, return true
      this.dialogRef.close(true);
    }, err => {
      // Close dialog, return false
      this.dialogRef.close(false);
      // Call api delete file
      console.error(err);
    });
  }

  // // File uploads
  // onSelectFile(event) {
  //   let i = 0;
  //   if (event.target.files && event.target.files[0]) {
  //     for (const file of event.target.files) {
  //       // =============================================
  //       let urlNone: any;
  //       let urlResult: any;
  //       let fileName = '';
  //       let fileNamesFull = '';

  //       // =============================================
  //       const reader = new FileReader();
  //       reader.onload = (eventLoad) => {
  //         this.uploaded = true;
  //         urlNone = eventLoad.target.result;
  //         this.imageCompress.compressFile(urlNone, -1, 75, 50).then(result => {
  //           this.urlPreview = result;
  //           urlResult = result.split(',')[1];
  //           this.fileImport = this.convertBase64toFile(result, file.name);
  //           if (this.filesInfo.length < 5) {
  //             this.files.push(this.fileImport);
  //             if (this.fileImport.name.length > 20) {
  //               // Tên file quá dài
  //               const startText = event.target.files[i].name.substr(0, 5);
  //               // tslint:disable-next-line:max-line-length
  //               const shortText = event.target.files[i].name.substring(event.target.files[i].name.length - 7,
  //                                                                       event.target.files[i].name.length);
  //               fileName = startText + '...' + shortText;
  //               // Tên file gốc - hiển thị tooltip
  //               fileNamesFull = event.target.files[i].name;
  //             } else {
  //               fileName = this.fileImport.name;
  //               fileNamesFull = this.fileImport.name ;
  //             }

  //             this.filesInfo.push({
  //               id: i,
  //               url: this.urlPreview,
  //               name: fileName,
  //               fullName: fileNamesFull
  //             });
  //           } else {
  //             this.main.openSnackBar('Số lượng ', 'hình ảnh ', 'không được vượt quá ', '5', 'error_notification');
  //           }
  //         });
  //       };
  //       reader.readAsDataURL(event.target.files[i]);
  //       i++;
  //     }
  //   }
  // }

  onSelectFile(event) {
    this.updateImageProgress = true;
    if (event.target.files && event.target.files[0]) {
      let i = 0;
      for (const file of event.target.files) {
        if (this.files.length + this.filesInfo.length + 1 <= environment.notification.maxImageUploadSize) {
          const reader = new FileReader();
          reader.onload = ((event) => {
            this.uploaded = true;
            this.filesInfo.push({
              id: i,
              url: event.target.result,
              name: file.name,
              fullName: file.name
            });
            //this.urls.push(event.target.result);
          });
          reader.readAsDataURL(file);
          this.files.push(file);
        } else {
          this.main.openSnackBar('Số lượng ', 'hình ảnh ', 'không được vượt quá ', environment.notification.maxImageUploadSize.toString(), 'error_notification');
        }
        i++;
      }
    }
    if (this.files.length > 0) {
      this.uploadImages(this.files);
    }
  }

  uploadImages(files) {
    console.log(this.uploadedImage);
    this.service
      .uploadMultiImages(files, this.accountId)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            event.body.forEach((imgInfo) => {
              this.uploadedImage.push(imgInfo.id);
            });
            console.log(this.uploadedImage);
            setTimeout(() => {
              this.progress = 0;
              this.updateImageProgress = false;
            }, 1500);
        }
      });
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

  convertBase64toFile(base64, filename) {
    const date = new Date().valueOf();
    const imageName = date + '.jpg';
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], filename, { type: 'image/jpg' });
    return imageFile;
  }

  // Xoá file
  removeItem(id: string) {
    let counter = 0;
    let index = 0;
    this.filesInfo.forEach(file => {
      if (file.id === id) {
        index = counter;
      }
      counter++;
    });
    this.uploadedImage = this.uploadedImage.filter(item => item != id);
    this.filesInfo.splice(index, 1);
    this.files.splice(index, 1);

    this.blankVal = '';
  }

  ngOnInit(): void {
    this.getNotificationDetail();
    this.getListTags();
    this.getAgency();
    this.initUserSearch();
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.keycloak.loadUserProfile().then((user) => {
      this.accountId = user['attributes'].user_id;
      this.username = user.username;
    });
  }

  getListTags() {
    this.service.getListTags(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      console.error(err);
    });
  }

  getNotificationDetail() {
    this.service.getNotificationDetail(this.notificationId).subscribe(data => {
      this.response.push(data);
      this.setViewData();
    }, err => {
      console.error(err);
    });
  }

  setViewData() {
    let tagSelected = [];
    let sent: boolean;
    for (const item of this.response[0].tag) {
      tagSelected.push(item.id);
    }
    tagSelected = tagSelected.map(String);

    this.userList = this.response[0].to;
    for (let i of this.userList){
      i.id = i.userId;
    }

    let userSelected = [];
    for (const item of this.response[0].to) {
      userSelected.push(item.userId);
    }
    userSelected = userSelected.map(String);

    if (this.response[0].publish.status === 0) {
      sent = false;
    } else {
      sent = true;
    }
    let expiredDateControl = new FormControl();

    if (this.response[0].expiredDate != null) {
      expiredDateControl = new FormControl(new Date(this.response[0].expiredDate));
    }

    this.updateForm = new FormGroup({
      title: new FormControl(this.response[0].title),
      content: new FormControl(this.response[0].content),
      agency: new FormControl('' + this.response[0].agency.id),
      tag: new FormControl(tagSelected),
      expiredDate: expiredDateControl,
      publish: new FormControl(sent),
      to: new FormControl(userSelected)
    });

    this.uploadedImage = this.response[0].imageId;

    this.countDefaultImage = this.uploadedImage.length;

    if (this.response[0].imageId.length > 0) {
      for (const i of this.response[0].imageId) {
        let urlResult: any;
        let fileName = '';
        let fileNamesFull = '';

        this.service.getImage(i).subscribe(data => {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            urlResult = reader.result;
            this.service.getImageName_Size(i).subscribe((data: any ) => {
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
                id: i,
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
      }
    }
    this.uploaded = true;
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }
}

export class ConfirmUpdateDialogModel {
  constructor(public title: string,
              public id: string) { }
}
