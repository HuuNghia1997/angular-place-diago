import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { ActivatedRoute, Router } from '@angular/router';
import { AllPetitionService } from 'src/app/data/service/all-petition.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiProviderService } from 'src/app/core/service/api-provider.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { petitionCategoryId } from 'src/app/data/service/config.service';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import { KeycloakService } from 'keycloak-angular';
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { reloadTimeout, petitionAcceptFileExtension, petitionAcceptFileType } from 'src/app/data/service/config.service';

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
    DatePipe
  ],
})
export class EditPetitionComponent implements OnInit {
  roleUser = [];
  isApproved = false;

  checkedIsPublic = false;
  checkedIsApproved = false;
  petition = [];
  fileUpload: ImageInfo[] = [];
  acceptFileExtension = petitionAcceptFileExtension;
  resultForm = new FormGroup({
    content: new FormControl(''),
    date: new FormControl(''),
    isPublic: new FormControl(''),
    approved: new FormControl(''),
    agency: new FormControl('')
  });

  petitionId: string;
  processInstanceId: string;
  token: any;
  agency = {
    id: '',
    name: [
      {
        languageId: 228,
        name: ''
      }
    ]
  };

  popupTitle: string;
  uploaded: boolean;
  blankVal: any;
  notificationId: string;
  accountId: string;

  uploadedImage: UpdateFile[] = [];
  upload = true;
  type: number[] = [];
  countDefaultImage;
  listTags = [];
  itemsListTags = [];
  files = [];
  filesInfo: ImageInfo[] = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;
  itemsListUsers = [];
  response = [];
  keyword: '';
  removedImage = [];

  constructor(
    public dialogRef: MatDialogRef<EditPetitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateDialogModel,
    public dialog: MatDialog,
    private service: AllPetitionService,
    private snackbar: SnackbarService,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private map: MapboxService,
    private keycloak: KeycloakService
  ) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getDetailPetition();
    this.getRoleUser();
  }

  getDetailPetition() {
    this.service.getPetitionDetail(this.petitionId).subscribe(data => {
      this.petition.push(data);
      this.setViewData();
    }, err => {
      console.log(err);
    });
  }

  setViewData() {
    let content = '';
    if (this.petition[0].result !== undefined) {
      content = this.petition[0].result.content;
      if (this.petition[0].result.isPublic === false) {
        this.checkedIsPublic = false;
      } else {
        this.checkedIsPublic = true;
      }
      if (this.petition[0].result.approved === true) {
        this.checkedIsApproved = true;
      } else {
        this.checkedIsApproved = false;
      }
    } else {
      this.checkedIsPublic = false;
      this.checkedIsApproved = false;
    }

    this.resultForm = new FormGroup({
      content: new FormControl(content),
      isPublic: new FormControl(this.checkedIsPublic),
      approved: new FormControl(this.checkedIsApproved)
    });

    this.uploadedImage = this.petition[0].file;

    this.countDefaultImage = this.uploadedImage.length;

    if (this.petition[0].file.length > 0) {
      this.petition[0].file.forEach(e => {
        if (e.group[0] === 3) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getImage(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getImageName_Size(e.id).subscribe((data: any) => {
                if (data.filename.length > 20) {
                  // Tên file quá dài
                  const startText = data.filename.substr(0, 5);
                  const shortText = data.filename.substr(data.filename.length - 6, data.filename.length);
                  fileName = startText + '...' + shortText;
                  // Tên file gốc - hiển thị tooltip
                  fileNamesFull = data.filename;
                } else {
                  fileName = data.filename;
                  fileNamesFull = data.filename;
                }
                this.fileUpload.push({
                  id: e,
                  url: urlResult,
                  name: fileName,
                  fullName: fileNamesFull
                });
              }, err => {
                console.error(err);
              });
            }, false);
            reader.readAsDataURL(file);
          }, err => {
            console.error(err);
          });
        }

      });
    }
    this.uploaded = true;
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  onSubmit() {
    this.uploadFile();
  }

  uploadFile() {
    (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'block';
    this.keycloak.loadUserProfile().then(user => {
      // tslint:disable-next-line: no-string-literal
      this.accountId = user['attributes'].user_id;
      this.countDefaultImage = this.uploadedImage.length;
      if (this.countDefaultImage > 0) {
        if (this.files.length > 0) {
          this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
            file.forEach(e => {
              this.type.push(3);
              this.uploadedImage.push({
                id: e.id,
                name: e.filename,
                group: this.type
              });
              this.type = [];
            });
            this.formToJson();
          });
        } else {
          this.formToJson();
        }
      } else {
        if (this.files.length > 0) {
          this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
            file.forEach(e => {
              this.type.push(3);
              this.uploadedImage.push({
                id: e.id,
                name: e.filename,
                group: this.type
              });
              this.type = [];
            });
            this.formToJson();
          });
        } else {
          this.formToJson();
        }
      }
    });
  }

  onFileSelected(event: any) {
    let i = 0;
    if (event.target.files && event.target.files[0]) {
      for (const file of event.target.files) {
        if (petitionAcceptFileType.indexOf(file.type) > 0) {
          // =============================================
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          // =============================================
          this.files.push(file);
          const reader = new FileReader();
          reader.onload = (eventLoad) => {
            this.upload = true;
            urlResult = eventLoad.target.result;
            if (file.name.length > 20) {
              // Tên file quá dài
              const startText = file.name.substr(0, 5);
              // tslint:disable-next-line:max-line-length
              const shortText = file.name.substring(file.name.length - 6, file.name.length);
              fileName = startText + '...' + shortText;
              // Tên file gốc - hiển thị tooltip
              fileNamesFull = file.name;
            } else {
              fileName = file.name;
              fileNamesFull = file.name;
            }
            const tempId = {id: file.lastModified.toString()};
            this.fileUpload.push({
              id: tempId,
              url: urlResult,
              name: fileName,
              fullName: fileNamesFull
            });
          };
          reader.readAsDataURL(event.target.files[i]);
          i++;
        } else {
          if (file.type.substring(file.type.lastIndexOf('/') + 1 ) === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
            this.snackbar.openSnackBar('Không hỗ trợ loại tệp tin', 'DOCX', '', '', 'error_notification');
          }
          else if (file.type.substring(file.type.lastIndexOf('/') + 1 ) === 'msword') {
            this.snackbar.openSnackBar('Không hỗ trợ loại tệp tin', 'DOC', '', '', 'error_notification');
          }
          else {
            this.snackbar.openSnackBar('Không hỗ trợ loại tệp tin', file.type.substring(file.type.lastIndexOf('/') + 1 ).toUpperCase(), '', '', 'error_notification');
          }
        }
      }
    }
  }

  // Xoá file
  removeItem(id: string) {
    this.blankVal = '';
    // fileUpload
    const updatedMainArray: ImageInfo[] = [];
    for (const file of this.fileUpload) {
      if (file.id.id !== id) {
        updatedMainArray.push(file);
      }
    }
    this.fileUpload = updatedMainArray;

    // uploadedImage
    const updatedArray = [];
    for (const file of this.uploadedImage) {
      if (file.id !== id) {
        updatedArray.push(file);
      }
    }
    this.uploadedImage = updatedArray;

    // files
    const newFilesArray = [];
    for (const file of this.files) {
      if (file.lastModified !== Number(id)) {
        newFilesArray.push(file);
      }
    }
    this.files = newFilesArray;

    if (id.length > 20) {
      this.removedImage.push(id);
    }
  }

  getRoleUser() {
    this.roleUser = this.keycloak.getUserRoles(true);
    this.roleUser.forEach(role => {
      if (role === 'citizens_petition_approver') {
        this.isApproved = true;
      }
    });
  }

  formToJson() {
    const formObj = this.resultForm.getRawValue();
    const oldData = this.petition;

    // Hide element
    delete oldData[0].result;
    delete oldData[0].file;

    oldData[0].file = this.uploadedImage;
    oldData[0].result = {};
    oldData[0].result.content = formObj.content;
    oldData[0].result.agency = this.petition[0].agency;
    oldData[0].result.isPublic = formObj.isPublic;
    oldData[0].result.approved = formObj.approved;
    const resultJSON = JSON.stringify(oldData[0], null, 2);
    this.updateResult(resultJSON);
  }

  updateResult(requestBody) {
    this.service.updatePetition(requestBody, this.petitionId).subscribe(res => {
      this.removedImage.forEach(id => {
        this.service.deleteFile(id).subscribe(data => {
        }, err => {
          console.log(err);
        });
      });
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(() => {
        (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
      }, 500);
      this.dialogRef.close(true);
    }, err => {
      setTimeout(() => {
        (document.querySelector('.loading_progress_bar') as HTMLElement).style.display = 'none';
      }, 500);
      this.dialogRef.close(false);
      console.error(err);
    });
  }

  checkPublic(event) {
    if (event.checked === true) {
      this.checkedIsPublic = true;
    } else {
      this.checkedIsPublic = false;
    }
  }

  checkAprroved(event) {
    if (event.checked === true) {
      this.checkedIsApproved = true;
    } else {
      this.checkedIsApproved = false;
    }
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  openLightbox(fileURL, fileId, fileName, type) {
    switch (type) {
      case 1:
        this.service.openLightbox(fileURL, fileId, this.fileUpload, fileName);
        break;
      case 2:
        this.service.openLightbox(fileURL, fileId, this.fileUpload, fileName);
        break;
    }
  }

  bypassSecurityTrustUrl(base64URL) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64URL);
  }
}
export class ConfirmUpdateDialogModel {
  constructor(public title: string, public id: string) {}
}
