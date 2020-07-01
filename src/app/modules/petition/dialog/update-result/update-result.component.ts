import { Component, OnInit, Inject } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { FormGroup, FormControl } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { PetitionService } from 'src/app/data/service/petition.service';
import * as jwt_decode from 'jwt-decode';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { ImageInfo } from 'src/app/data/schema/image-info';
import { DatePipe } from '@angular/common';
import { NgxImageCompressService } from 'ngx-image-compress';

function readBase64(file): Promise<any> {
  const reader  = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('load', function() {
      resolve(reader.result);
    }, false);

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener('error', function(event) {
      reject(event);
    }, false);

    reader.readAsDataURL(file);
  });
  return future;
}

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
  itemsListUsers = [];
  response = [];
  keyword: '';

  constructor(private keycloak: KeycloakService,
              private service: PetitionService,
              public dialogRef: MatDialogRef<UpdateResultComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateResultDialogModel,
              private snackbar: SnackbarService,
              public datepipe: DatePipe,
              private imageCompress: NgxImageCompressService) {
    this.petitionId = data.id;
  }

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt'],
    url: ''
  });
  public hasBaseDropZoneOver = false;

  ngOnInit(): void {
    this.getRoleUser();
    this.getDetailPetition();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  splitBase64(base64) {
    const a = base64.split('/', 2)[0];
    return a;
  }

  onFileSelected(event: any) {
    // const file: File = event[0];
    // console.log(file);
    // // tslint:disable-next-line:only-arrow-functions
    // readBase64(file).then(function(data) {
    //   console.log(data);
    // });
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
            console.log('List files: ');
            console.log(this.files);
            console.log('Result file: ');
            console.log(event.target.files[i]);
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
  }

  getDetailPetition() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.petition.push(data.list.entries[0].entry);
      this.setViewData();
      this.processInstanceId = this.petition[0].processVariables.petitionData.processInstanceId;
    });
  }

  updateResult(requestBody) {
    this.service.postVariable(this.processInstanceId, requestBody).subscribe(res => {
      this.dialogRef.close(true);
    }, err => {
      this.dialogRef.close(false);
      console.error(err);
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
    formObj.variables.petitionData.file = this.petition[0].processVariables.petitionData.file;

    formObj.variables.petitionData.reporter  = this.petition[0].processVariables.petitionData.reporter;
    formObj.variables.petitionData.thumbnailId = this.petition[0].processVariables.petitionData.thumbnailId;
    formObj.variables.petitionData.createdDate = this.petition[0].processVariables.petitionData.createdDate;
    formObj.variables.petitionData.isPublic = this.petition[0].processVariables.petitionData.isPublic;
    formObj.variables.petitionData.isAnonymous = this.petition[0].processVariables.petitionData.isAnonymous;
    formObj.variables.petitionData.processInstanceId = this.petition[0].processVariables.petitionData.processInstanceId;
    formObj.variables.petitionData.deploymentId = this.petition[0].processVariables.petitionData.deploymentId;
    formObj.variables.petitionData.agency = this.petition[0].processVariables.petitionData.agency;
    formObj.variables.petitionData.receptionMethod = this.petition[0].processVariables.petitionData.receptionMethod;

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
    // this.updateResult(resultJSON);
  }

  onSubmit() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.token = this.keycloak.getKeycloakInstance().token;
      this.decodeToken(this.token);
      this.petition.push(data.list.entries[0].entry);
      this.formToJson();
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
