import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { PetitionService } from 'src/app/data/service/petition.service';
import * as jwt_decode from 'jwt-decode';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { reloadTimeout, petitionAcceptFileExtension, petitionAcceptFileType } from 'src/app/data/service/config.service';

@Component({
  selector: 'app-update-result',
  templateUrl: './update-result.component.html',
  styleUrls: ['./update-result.component.scss'],
  providers: [
    DatePipe
  ]
})
export class UpdateResultComponent implements OnInit {

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

  taskId: string;
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

  constructor(private keycloak: KeycloakService,
              private service: PetitionService,
              public dialogRef: MatDialogRef<UpdateResultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateResultDialogModel,
              public datepipe: DatePipe,
              private sanitizer: DomSanitizer,
              private snackbar: SnackbarService) {
    this.taskId = data.taskId;
  }

  ngOnInit(): void {
    this.getRoleUser();
    this.getDetailPetition();
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

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  decodeToken(token) {
    const tokenInfo = this.getDecodedAccessToken(token);
    this.agency.id = tokenInfo.agency_id;
    this.agency.name.forEach(e => {
      e.languageId = 228;
      e.name = tokenInfo.agency_name;
    });
  }

  setViewData() {
    if (this.petition[0].taskLocalVariables.isPublic === false) {
      this.checkedIsPublic = false;
    } else {
      this.checkedIsPublic = true;
    }

    if (this.petition[0].taskLocalVariables.petitionData.result.approved === true) {
      this.checkedIsApproved = true;
    } else {
      this.checkedIsApproved = false;
    }

    this.resultForm = new FormGroup({
      content: new FormControl(this.petition[0].taskLocalVariables.petitionData.result.content),
      isPublic: new FormControl(this.checkedIsPublic),
      approved: new FormControl(this.checkedIsApproved)
    });

    this.uploadedImage = this.petition[0].taskLocalVariables.petitionData.file;

    this.countDefaultImage = this.uploadedImage.length;

    if (this.petition[0].taskLocalVariables.petitionData.file.length > 0) {
      this.petition[0].taskLocalVariables.petitionData.file.forEach(e => {
        if (e.group[0] === 3) {
          let urlResult: any;
          let fileName = '';
          let fileNamesFull = '';

          this.service.getFile(e.id).subscribe(file => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              urlResult = reader.result;
              this.service.getFileName_Size(e.id).subscribe((data: any) => {
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

  updateResult(requestBody) {
    this.service.putVariable(this.taskId, requestBody).subscribe(res => {
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

  getDetailPetition() {
    this.service.getDetailPetition(this.taskId).subscribe(data => {
      this.petition.push(data.entry);
      this.setViewData();
    }, err => {
      console.log(err);
    });
  }

  formToJson() {
    const formObj = this.resultForm.getRawValue();
    formObj.payloadType = 'UpdateTaskVariablePayload';
    formObj.taskId = this.taskId;
    // Value
    formObj.value = {};
    formObj.value.id = this.petition[0].taskLocalVariables.petitionData.id;
    formObj.value.title = this.petition[0].taskLocalVariables.petitionData.title;
    formObj.value.description = this.petition[0].taskLocalVariables.petitionData.description;
    // takePlaceAt
    formObj.value.takePlaceAt = this.petition[0].taskLocalVariables.petitionData.takePlaceAt;
    // reporterLocation
    formObj.value.reporterLocation = this.petition[0].taskLocalVariables.petitionData.reporterLocation;
    // takePlaceOn
    formObj.value.takePlaceOn = this.datepipe.transform(this.petition[0].taskLocalVariables.petitionData.takePlaceOn, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    // status
    formObj.value.status = this.petition[0].taskLocalVariables.petitionData.status;
    // confirm
    formObj.value.confirm = this.petition[0].taskLocalVariables.petitionData.confirm;
    // tag
    formObj.value.tag = this.petition[0].taskLocalVariables.petitionData.tag;
    // file
    formObj.value.file = this.uploadedImage;
    // reporter
    formObj.value.reporter = this.petition[0].taskLocalVariables.petitionData.reporter;
    // thumbnailId
    formObj.value.thumbnailId = this.petition[0].taskLocalVariables.petitionData.thumbnailId;
    // createdDate
    formObj.value.createdDate = this.petition[0].taskLocalVariables.petitionData.createdDate;
    // isPublic
    formObj.value.isPublic = this.petition[0].taskLocalVariables.petitionData.isPublic;
    // isAnonymous
    formObj.value.isAnonymous = this.petition[0].taskLocalVariables.petitionData.isAnonymous;
    // deploymentId
    formObj.value.deploymentId = this.petition[0].taskLocalVariables.petitionData.deploymentId;
    // agency
    formObj.value.agency = this.petition[0].taskLocalVariables.petitionData.agency;
    // receptionMethod
    formObj.value.receptionMethod = this.petition[0].taskLocalVariables.petitionData.receptionMethod;
    // step
    formObj.value.step = this.petition[0].taskLocalVariables.petitionData.step;
    // result
    formObj.value.result = {};
    formObj.value.result.content = formObj.content;
    formObj.value.result.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    formObj.value.result.isPublic = this.checkedIsPublic;
    formObj.value.result.approved = this.checkedIsApproved;

    // Hide element
    delete formObj.variables;

    const resultJSON = JSON.stringify(formObj, null, 2);
    this.updateResult(resultJSON);
  }

  onSubmit() {
    this.uploadFile();
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

export class ConfirmUpdateResultDialogModel {
  constructor(public title: string,
              public taskId: string) { }
}
