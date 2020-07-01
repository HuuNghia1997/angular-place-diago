import { Component, OnInit, ViewChild } from '@angular/core';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import { NgxImageCompressService } from 'ngx-image-compress';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { petitionCategoryId } from 'src/app/data/service/config.service';
import { MapComponent } from 'src/app/modules/accept-petition/dialog/map/map.component';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { KeycloakService } from 'keycloak-angular';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/data/schema/user';
import { HttpEvent, HttpEventType } from '@angular/common/http';

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
    DatePipe,
  ],
})
export class AddPetitionComponent implements OnInit {
  // Initialization
  categoryId = petitionCategoryId;
  tagList = [];
  agencyList: AgencyInfo[] = [];
  reporterTypeList: any = [
    { id: 1, name: 'Cá nhân' },
    { id: 2, name: 'Tổ chức' },
    { id: 3, name: 'Khác' },
  ];
  place = [];
  accountId: string;
  username: string;

  progress: number = 0;

  // Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  addForm = new FormGroup({
    // Temporary variable
    reporterFullName: new FormControl(''),
    reporterPhone: new FormControl(''),
    reporterIdentityId: new FormControl(''),
    reporterType: new FormControl(1),
    reporterFullAddress: new FormControl(''),
    reporterPlaceVillage: new FormControl(''),
    reporterPlaceTown: new FormControl(''),
    reporterPlaceProvince: new FormControl(82),
    reporterLocation: new FormControl(''),
    petitionFullAddress: new FormControl(''),
    petitionLatitude: new FormControl(''),
    petitionLongitude: new FormControl(''),

    // Body post request
    title: new FormControl(''),
    tag: new FormControl(),
    reporter: new FormControl(''),
    takePlaceOn: new FormControl(''),
    agency: new FormControl(''),
    description: new FormControl(''),
    takePlaceAt: new FormControl(''),
    sendSms: new FormControl(''),
    isPublic: new FormControl('Công khai phản ánh'),
    file: new FormControl(),
    thumbnailId: new FormControl(),
    isAnonymous: new FormControl(),
    receptionMethod: new FormControl(),
  });
  reporterFullName = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);
  reporterPhone = new FormControl('', [Validators.required]);
  title = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);
  tag = new FormControl('', [Validators.required]);
  takePlaceOn = new FormControl('', [Validators.required]);
  description = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);
  takePlaceAt = new FormControl('', [
    Validators.required,
    Validators.pattern(this.reg),
  ]);

  // Upload file
  uploaded: boolean;
  blankVal: any;
  uploadedImage = [];
  files = [];
  urls = [];
  fileNames = [];
  fileNamesFull = [];
  fileImport: File;
  urlPreview: any;

  // Pick Date
  @ViewChild('pickerOccurred') pickerOccurred: any;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  // Search address
  provinces = [];
  towns = [];
  villages = [];

  constructor(
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<AddPetitionComponent>,
    private imageCompress: NgxImageCompressService,
    private main: SnackbarService,
    private dialog: MatDialog,
    private keycloak: KeycloakService,
    public datepipe: DatePipe,
    private map: MapboxService
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getListTag();
    this.getAgency();
    this.getProvince();
    this.getTown(82);
    this.map.currentPlace.subscribe((searchedPlace) =>
      this.addForm.controls.petitionFullAddress.setValue(searchedPlace)
    );
    this.map.currentLatitude.subscribe((latitude) =>
      this.addForm.controls.petitionLatitude.setValue(latitude)
    );
    this.map.currentLongitude.subscribe((longitude) =>
      this.addForm.controls.petitionLongitude.setValue(longitude)
    );
  }

  // Lấy danh sách chuyên mục từ service
  public getListTag() {
    this.service.getListTag(this.categoryId).subscribe(
      (data) => {
        const size = data.numberOfElements;
        for (let i = 0; i < size; i++) {
          this.tagList.push(data.content[i]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  public getProvince() {
    const nationId = 1;
    const parentTypeId = 1;
    this.service.getPlace(nationId, parentTypeId).subscribe((data) => {
      data.forEach((item) => {
        this.provinces.push(item);
      });
      // this.place = data;
    });
  }

  public getTown(parentId) {
    this.resetTown();
    this.resetVillage();
    const nationId = 1;
    const parentTypeId = 2;
    this.service
      .getPlaceTown(nationId, parentTypeId, parentId)
      .subscribe((data) => {
        data.forEach((item) => {
          this.towns.push(item);
        });
        // this.place = data;
      });
  }

  public getVillage(parentId) {
    // this.villages = [];
    this.resetVillage();
    const nationId = 1;
    const parentTypeId = 3;
    this.service
      .getPlaceTown(nationId, parentTypeId, parentId)
      .subscribe((data) => {
        data.forEach((item) => {
          this.villages.push(item);
        });
        // this.place = data;
      });
  }

  setValueTown() {
    return this.getTown(this.addForm.controls.reporterPlaceProvince.value);
  }

  setValueVillage() {
    let parentId = this.addForm.controls.reporterPlaceTown.value;
    return this.getVillage(parentId);
  }

  resetTown() {
    this.towns = [];
  }

  resetVillage() {
    this.villages = [];
  }

  // Lấy danh sách đơn vị phản ánh
  getAgency() {
    this.service.getAgency().subscribe((data) => {
      this.agencyList = data.content;
    });
  }

  // Post petition
  postPetition(requestBody) {
    this.service.postPetition(requestBody).subscribe(
      (data) => {
        // Close dialog, return true
        let result = {
          body: requestBody,
          data: data,
        };
        this.dialogRef.close(result);
      },
      (err) => {
        // Close dialog
        this.dialogRef.close(false);
        // Call api delete file
      }
    );
  }

  getUserProfile(): void {
    this.keycloak.loadUserProfile().then((user) => {
      this.accountId = user['attributes'].user_id;
      this.username = user.username;
    });
  }

  onConfirm(): void {
    this.formToJSON();
  }

  formToJSON() {
    const formObject = this.addForm.getRawValue();

    // if(formObject.reporterIdentityId === null) {
    //   formObject.reporterIdentityId = "";
    // }
    // Set Tag
    const selectedTag = formObject.tag;
    console.log(formObject.tag);
    formObject.tag = this.tagList.find((p) => p.id == selectedTag);
    delete formObject.tag.parentId;
    delete formObject.tag.orderNumber;
    delete formObject.tag.status;
    delete formObject.tag.createdDate;
    delete formObject.tag.description;
    delete formObject.tag.iconId;

    // Set takePlaceOn
    formObject.takePlaceOn = this.datepipe.transform(
      formObject.takePlaceOn,
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    );

    // Add agency
    if (formObject.agency !== null) {
      const selectedAgency = formObject.agency;
      formObject.agency = this.agencyList.find((p) => p.id == selectedAgency);
      delete formObject.agency.logoId;
    }

    // Set takePlaceAt
    formObject.takePlaceAt = {
      latitude: formObject.petitionLatitude,
      longitude: formObject.petitionLongitude,
      fullAddress: formObject.petitionFullAddress,
    };

    // Set reporter location
    formObject.reporterLocation = {
      latitude: '10.341645',
      longitude: '106.458985',
      fullAddress: formObject.reporterFullAddress,
    };

    // Set reporter
    let province = this.provinces.find(
      (p) => p.id == formObject.reporterPlaceProvince
    );
    let town = this.towns.find((p) => p.id == formObject.reporterPlaceTown);
    let village = this.villages.find(
      (p) => p.id == formObject.reporterPlaceVillage
    );

    // if (formObject.reporterPlaceTown == '') {

    // }

    formObject.reporter = {
      id: this.accountId[0],
      username: this.username,
      fullname: formObject.reporterFullName,
      phone: formObject.reporterPhone,
      identityId: formObject.reporterIdentityId,
      type: formObject.reporterType,
      address: {
        address: formObject.reporterFullAddress,
        place: [
          {
            id: village.id,
            typeId: 3,
            name: village.name,
          },
          {
            id: town.id,
            typeId: 2,
            name: town.name,
          },
          {
            id: province.id,
            typeId: 1,
            name: province.name,
          },
        ],
      },
    };

    // Set public
    if (formObject.isPublic) {
      formObject.isPublic = true;
    } else {
      formObject.isPublic = false;
    }

    // Set thumbnailId
    formObject.thumbnailId = '5df0aa1579279af9f7ba1234';

    // Set isAnonymous
    formObject.isAnonymous = false;

    // Format send sms
    if (formObject.sendSms) {
      formObject.sendSms = true;
    } else {
      formObject.sendSms = false;
    }

    // receptionMethod
    formObject.receptionMethod = 3;

    // Add Image
    formObject.file = this.uploadedImage;

    // // Temporary variable - Final result
    delete formObject.reporterFullName;
    delete formObject.reporterPhone;
    delete formObject.reporterIdentityId;
    delete formObject.reporterType;
    delete formObject.reporterFullAddress;
    delete formObject.reporterPlaceVillage;
    delete formObject.reporterPlaceTown;
    delete formObject.reporterPlaceProvince;
    delete formObject.petitionFullAddress;
    delete formObject.petitionLatitude;
    delete formObject.petitionLongitude;

    const resultJson = JSON.stringify(formObject, null, 2);

    console.log(resultJson);
    this.postPetition(resultJson);
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
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
    let urlPreview;
    let fileImport;
    let files = [];

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
              urlPreview = result;
              this.fileImport = this.convertBase64toFile(
                this.urlPreview,
                file.name
              );
              fileImport = this.convertBase64toFile(urlPreview, file.name);
              if (this.urls.length + 1 <= 5) {
                this.urls.push(this.urlPreview);
                this.files.push(this.fileImport);
                files.push(fileImport);
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

    setTimeout(() => {
      this.uploadImages(files);
    }, 1500);
  }

  uploadImages(files) {
    this.service
      .uploadMultiImages(files, this.accountId)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            event.body.forEach((imgInfo) => {
              let temp = {
                id: imgInfo.id,
                name: imgInfo.filename,
                group: 1,
                updateDate: this.datepipe.transform(
                  new Date(),
                  "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                ),
              };
              this.uploadedImage.push(temp);
            });
            setTimeout(() => {
              this.progress = 0;
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

  openDialogMap() {
    const dialogRef = this.dialog.open(MapComponent, {
      width: '80%',
      height: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }
}

export class ConfirmAddDialogModel {
  constructor(public title: string) {}
}
