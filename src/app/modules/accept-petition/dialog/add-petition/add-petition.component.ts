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

  submitted = true;
  categoryId = petitionCategoryId;
  accountId: string;

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
    reporterPlaceProvince: new FormControl(''),
    reporterLocation: new FormControl(''),

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

  // Initialization list of tag
  tagList = [];
  agencyList: AgencyInfo[] = [];
  place = [];

  topicList: string[] = [
    'Giao thông',
    'Y tế',
    'Giáo dục',
    'Môi trường',
    'Cơ sở hạ tầng',
  ];

  reporterList: string[] = ['Tổ chức', 'Cá nhân'];

  uploaded: boolean;
  blankVal: any;
  uploadedImage = [];
  listTags = [];
  itemTagList = [];
  files = [];
  urls = [];
  fileNames = [];
  fileNamesFull = [];
  imgResultAfterCompress: string;
  localCompressedURl: any;
  fileImport: File;
  urlPreview: any;
  userList: User[] = [];
  itemsListUser = [];
  takePlaceAtItem: any;

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  searchedPlace: string = '';
  latitude: string = '';
  longitude: string = '';

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
    this.getListTag();
    this.getAgency();
    this.getProvince();
    this.map.currentPlace.subscribe(
      (searchedPlace) => (this.searchedPlace = searchedPlace)
    );
    this.map.currentLatitude.subscribe((latitude) => (this.latitude = latitude));
    this.map.currentLongitude.subscribe((longitude) => (this.longitude = longitude));
  }

  placeList = [];
  placeListTown = [];
  placeListVillage = [];
  reporterTypeList: any = [
    { id: 1, name: 'Cá nhân' },
    { id: 2, name: 'Tổ chức' },
    { id: 3, name: 'Khác' },
  ];

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
        this.placeList.push(item);
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
          this.placeListTown.push(item);
        });
        // this.place = data;
      });
  }

  public getVillage(parentId) {
    // this.placeListVillage = [];
    this.resetVillage();
    const nationId = 1;
    const parentTypeId = 3;
    this.service
      .getPlaceTown(nationId, parentTypeId, parentId)
      .subscribe((data) => {
        data.forEach((item) => {
          this.placeListVillage.push(item);
        });
        // this.place = data;
      });
  }

  setValueTown() {
    return this.getTown(
      this.addForm.controls.reporterPlaceProvince.value
    );
  }

  setValueVillage() {
    let parentId = this.addForm.controls.reporterPlaceTown.value;
    return this.getVillage(parentId);
  }

  resetTown() {
    this.placeListTown = [];
  }

  resetVillage() {
    this.placeListVillage = [];
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
        // Close dialog, return false
        this.dialogRef.close(false);
        // Call api delete file
      }
    );
  }

  onConfirm(): void {
    this.submitted = false;
    if (this.files.length > 0) {
      this.keycloak.loadUserProfile().then((user) => {
        // tslint:disable-next-line: no-string-literal
        this.accountId = user['attributes'].user_id;

        this.service.uploadMultiImages(this.files, this.accountId).subscribe(
          (data: any) => {
            data.forEach((imgInfo) => {
              this.uploadedImage.push(imgInfo.id);
            });
            this.formToJSON();
          },
          (error) => {
            console.error(error);
          }
        );
      });
    } else {
      this.formToJSON();
    }
  }

  formToJSON() {
    const formObject = this.addForm.getRawValue();

    // Title, Description
    // formObject.title = 'Test post phan anh 4';
    // formObject.description = 'Mô tả phản ánh';

    // Tag
    const selectedTag = formObject.tag;
    formObject.tag = this.tagList.find((p) => p.id == selectedTag);
    delete formObject.agency.logoId;
    delete formObject.tag.parentId;
    delete formObject.tag.orderNumber;
    delete formObject.tag.status;
    delete formObject.tag.createdDate;
    delete formObject.tag.description;
    delete formObject.tag.iconId;

    // for (const i of formObject.tag) {
    //   // tslint:disable-next-line: triple-equals
    //   const item = this.tagList.find((p) => p.id == i);
    //   this.itemTagList.push(item);
    // }
    // this.itemTagList = this.itemTagList.map((item) => {
    //   delete item.parentId;
    //   delete item.orderNumber;
    //   delete item.status;
    //   delete item.createdDate;
    //   delete item.description;
    //   delete item.iconId;
    //   return item;
    // });
    // formObject.tag = this.itemTagList;
    // formObject.tag = {
    //   id: 1,
    //   name: "Trật tự đô thị"
    // }

    // Format takePlaceOn
    formObject.takePlaceOn = this.datepipe.transform(
      formObject.takePlaceOn,
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    );

    // Add agency
    const selectedAgency = formObject.agency;
    formObject.agency = this.agencyList.find((p) => p.id == selectedAgency);
    delete formObject.agency.logoId;
    // formObject.agency = {
    //   id: 1,
    //   name: 'UBND Tỉnh Tiền Giang',
    // };

    // Add takePlaceAt
    if(this.searchedPlace == null) {
      this.addForm.controls.takePlaceAt.setValue(this.searchedPlace);
    }

    formObject.takePlaceAt = {
      latitude: this.latitude,
      longitude: this.longitude,
      fullAddress: this.searchedPlace,
    };


    // take reporter location
    formObject.reporterLocation = {
      latitude: '10.341645',
      longitude: '106.458985',
      fullAddress:
        'Ấp Phong Thuận, Xã Tân Mỹ Chánh, TP Mỹ tho, Tỉnh Tiền Giang',
    };

    // file
    formObject.file = [
      {
        id: '5df0aa1579279af9f7ba4412',
        name: 'image1.png',
        group: '1',
        updateDate: '2019-07-21T17:32:28.236+0700',
      },
      {
        id: '5df0aa1579229af9f7ba4415',
        name: 'image2.jpg',
        group: '1',
        updateDate: '2019-07-21T17:32:28.236+0700',
      },
    ];

    // reporter
    formObject.reporter = {
      id: '5df0aa1579279af9f7ba4432',
      username: '+84941234567',
      fullname: formObject.reporterFullName,
      phone: formObject.reporterPhone,
      identityId: formObject.reporterIdentityId,
      type: formObject.reporterType,
      address: {
        address: formObject.reporterFullAddress,
        place: [
          {
            id: 3,
            typeId: 3,
            name: 'Tân Mỹ Chánh',
          },
          {
            id: 2,
            typeId: 2,
            name: 'Mỹ Tho',
          },
          {
            id: 1,
            typeId: 1,
            name: 'Tiền Giang',
          },
        ],
      },
    };

    // Format publish
    if (formObject.isPublic) {
      formObject.isPublic = true;
    } else {
      formObject.isPublic = false;
    }

    // thumbnailId
    formObject.thumbnailId = '5df0aa1579279af9f7ba1234';

    // isAnonymous
    if (formObject.isPublic) {
      formObject.isAnonymous = true;
    } else {
      formObject.isAnonymous = false;
    }

    // Format send sms
    if (formObject.sendSms) {
      formObject.sendSms = true;
    } else {
      formObject.sendSms = false;
    }

    // receptionMethod
    formObject.receptionMethod = 1;

    // Add Image
    // formObject.imageId = this.uploadedImage;

    // // Temporary variable - Final result
    delete formObject.reporterFullName;
    delete formObject.reporterPhone;
    delete formObject.reporterIdentityId;
    delete formObject.reporterType;
    delete formObject.reporterFullAddress;
    delete formObject.reporterPlaceVillage;
    delete formObject.reporterPlaceTown;
    delete formObject.reporterPlaceProvince;
    const resultJson = JSON.stringify(formObject, null, 2);

    console.log(resultJson);
    // this.postPetition(resultJson);
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
