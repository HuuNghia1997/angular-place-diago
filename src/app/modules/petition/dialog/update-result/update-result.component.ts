import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { PetitionService } from 'src/app/data/service/petition.service';
import * as jwt_decode from 'jwt-decode';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { DatePipe } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';

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

  updateForm = new FormGroup({
    variables: new FormGroup({
      title: new FormControl(''),
      petitionData: new FormGroup({
        id: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        takePlaceAt: new FormControl(''),
        reporterLocation: new FormControl(''),
        takePlaceOn: new FormControl(''),
        status: new FormControl(''),
        confirm: new FormControl(''),
        workflow: new FormControl(''),
        tag: new FormControl(''),
        file: new FormControl(''),
        reporter: new FormControl(''),
        thumbnailId: new FormControl(''),
        createdDate: new FormControl(''),
        isPublic: new FormControl(''),
        isAnonymous: new FormControl(''),
        result: new FormGroup({}),
        processInstanceId: new FormControl(''),
        deploymentId: new FormControl(''),
        agency: new FormControl(''),
        receptionMethod: new FormControl('')
      }),
    }),
    payloadType: new FormControl('')
  });

  result = new FormGroup({
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

  constructor(private keycloak: KeycloakService,
              private service: PetitionService,
              public dialogRef: MatDialogRef<UpdateResultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateResultDialogModel,
              public datepipe: DatePipe) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getRoleUser();
    this.getDetailPetition();
  }

  onFileSelected(event: any) {
    let i = 0;
    if (event.target.files && event.target.files[0]) {
        for (const file of event.target.files) {
            // =============================================
            let urlResult: any;
            let fileName = '';
            let fileNamesFull = '';

            // =============================================
            this.files.push(file);
            const reader = new FileReader();
            reader.onload = (eventLoad) => {
                this.uploaded = true;
                urlResult = eventLoad.target.result;
                if (file.name.length > 20) {
                    // Tên file quá dài
                    const startText = event.target.files[i].name.substr(0, 5);
                    // tslint:disable-next-line:max-line-length
                    const shortText = event.target.files[i].name.substring(event.target.files[i].name.length - 7, event.target.files[i].name.length);
                    fileName = startText + '...' + shortText;
                    // Tên file gốc - hiển thị tooltip
                    fileNamesFull = event.target.files[i].name;
                } else {
                    fileName = file.name;
                    fileNamesFull = file.name ;
                }
                this.filesInfo.push( {
                    id: i,
                    url: urlResult,
                    name: fileName,
                    fullName: fileNamesFull
                });
            };
            reader.readAsDataURL(event.target.files[i]);
            i++;
        }
    }
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
    this.uploadedImage = this.uploadedImage.filter(item => item.id != id);
    this.filesInfo.splice(index, 1);
    this.files.splice(index, 1);

    this.blankVal = '';
    console.log('List file còn lại: ');
    console.log(this.files);
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
    if (this.petition[0].processVariables.petitionData.result.isPublic === true) {
      this.checkedIsPublic = true;
    } else {
      this.checkedIsPublic = false;
    }

    if (this.petition[0].processVariables.petitionData.result.approved === true) {
      this.checkedIsApproved = true;
    } else {
      this.checkedIsApproved = false;
    }

    this.result = new FormGroup({
      content: new FormControl(this.petition[0].processVariables.petitionData.result.content),
      isPublic: new FormControl(this.checkedIsPublic),
      approved: new FormControl(this.checkedIsApproved)
    });

    this.uploadedImage = this.petition[0].processVariables.petitionData.file;

    this.countDefaultImage = this.uploadedImage.length;

    if (this.petition[0].processVariables.petitionData.file.length > 0) {
      for (const i of this.petition[0].processVariables.petitionData.file) {
        let urlResult: any;
        let fileName = '';
        let fileNamesFull = '';

        this.service.getFile(i.id).subscribe(data => {
          const reader = new FileReader();
          reader.addEventListener('load', () => {
            urlResult = reader.result;
            this.service.getFileName_Size(i.id).subscribe((data: any ) => {
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

  getDetailPetition() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.petition.push(data.list.entries[0].entry);
      this.setViewData();
    });
  }

  updateResult(requestBody) {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.service.postVariable(data.list.entries[0].entry.processInstanceId, requestBody).subscribe(res => {
        this.dialogRef.close(true);
      }, err => {
        this.dialogRef.close(false);
        console.error(err);
      });
    });
  }

  formToJson() {
    const formObj = this.updateForm.getRawValue();
    formObj.variables.title = this.petition[0].processVariables.title;
    formObj.variables.petitionData.id = this.petition[0].processVariables.petitionData.id;
    formObj.variables.petitionData.title = this.petition[0].processVariables.title;
    formObj.variables.petitionData.description = this.petition[0].processVariables.petitionData.description;
    formObj.variables.petitionData.takePlaceAt = this.petition[0].processVariables.petitionData.takePlaceAt;
    formObj.variables.petitionData.reporterLocation = this.petition[0].processVariables.petitionData.reporterLocation;
    formObj.variables.petitionData.takePlaceOn = this.petition[0].processVariables.petitionData.takePlaceOn;
    formObj.variables.petitionData.status = this.petition[0].processVariables.status;
    formObj.variables.petitionData.confirm = this.petition[0].processVariables.confirm;
    formObj.variables.petitionData.workflow = this.petition[0].processVariables.petitionData.workflow;
    formObj.variables.petitionData.tag = this.petition[0].processVariables.petitionData.tag;

    formObj.variables.petitionData.reporter  = this.petition[0].processVariables.petitionData.reporter;
    formObj.variables.petitionData.thumbnailId = this.petition[0].processVariables.petitionData.thumbnailId;
    formObj.variables.petitionData.createdDate = this.petition[0].processVariables.petitionData.createdDate;
    formObj.variables.petitionData.isPublic = this.petition[0].processVariables.petitionData.isPublic;
    formObj.variables.petitionData.isAnonymous = this.petition[0].processVariables.petitionData.isAnonymous;
    formObj.variables.petitionData.processInstanceId = this.petition[0].processVariables.petitionData.processInstanceId;
    formObj.variables.petitionData.deploymentId = this.petition[0].processVariables.petitionData.deploymentId;
    formObj.variables.petitionData.agency = this.petition[0].processVariables.petitionData.agency;
    formObj.variables.petitionData.receptionMethod = this.petition[0].processVariables.petitionData.receptionMethod;

    formObj.variables.petitionData.file = this.uploadedImage;

    const a = this.result.getRawValue();
    formObj.variables.petitionData.result.content = a.content;
    formObj.variables.petitionData.result.isPublic = this.checkedIsPublic;
    formObj.variables.petitionData.result.approved = this.checkedIsApproved;
    formObj.variables.petitionData.result.agency = this.agency;

    let newPublishedDate: string;
    if (this.checkedIsApproved === true) {
      newPublishedDate = new Date().toString();
      formObj.variables.petitionData.result.date = this.datepipe.transform(newPublishedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    } else {
      formObj.variables.petitionData.result.date = this.datepipe.transform(newPublishedDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    }

    formObj.payloadType = 'SetProcessVariablesPayload';

    const resultJSON = JSON.stringify(formObj, null, 2);
    // console.log(resultJSON);
    this.updateResult(resultJSON);
  }

  onSubmit() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.token = this.keycloak.getKeycloakInstance().token;
      this.decodeToken(this.token);
      this.petition.push(data.list.entries[0].entry);

      this.keycloak.loadUserProfile().then(user => {
        // tslint:disable-next-line: no-string-literal
        this.accountId = user['attributes'].user_id;
        this.countDefaultImage = this.uploadedImage.length;
        if (this.countDefaultImage > 0) {
          if (this.files.length > 0) {
            this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
              this.uploadedImage = file;
              const size = file.length;
              for (let i = 0; i < size; i++) {
                this.type.push(3);
                this.uploadedImage[i].group = this.type;
                this.uploadedImage[i].name = file[i].filename;
                this.type = [];
              }
              this.formToJson();
            });
          } else {
            this.formToJson();
          }
        } else {
          if (this.files.length > 0) {
            this.service.uploadMultiImages(this.files, this.accountId).subscribe((file) => {
              this.uploadedImage = file;
              const size = file.length;
              for (let i = 0; i < size; i++) {
                this.type.push(3);
                this.uploadedImage[i].group = this.type;
                this.uploadedImage[i].name = file[i].filename;
                this.type = [];
              }
              this.formToJson();
            });
          } else {
            this.formToJson();
          }
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
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
}

export class ConfirmUpdateResultDialogModel {
  constructor(public title: string,
              public id: string) { }
}
