import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { FileUploader } from 'ng2-file-upload';
import { MapComponent } from 'src/app/modules/accept-petition/dialog/map/map.component';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { petitionCategoryId } from 'src/app/data/service/config.service';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { KeycloakService } from 'keycloak-angular';
import { query } from '@angular/animations';

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
    DatePipe,
  ],
})
export class EditPetitionComponent implements OnInit {
  // Khởi tạo tham số ban đầu
  titleDialog: string = 'phản ánh';
  petitionId: string;
  categoryId = petitionCategoryId;
  response = [];
  accountId: string;
  submitted = false;

  // Upload file
  countDefaultImage;

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
  itemsListUser = [];
  takePlaceAtItem: any;

  // Khởi tạo tham số cho map service
  searchedPlace: string = '';
  latitude: string = '';
  longitude: string = '';

  // Form
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  updateForm = new FormGroup({
    // Temporary variable
    reporterFullName: new FormControl(''),
    reporterPhone: new FormControl(''),
    reporterIdentityId: new FormControl(''),
    reporterType: new FormControl(''),
    reporterFullAddress: new FormControl(''),
    reporterPlaceVillage: new FormControl(''),
    reporterPlaceTown: new FormControl(''),
    reporterPlaceProvince: new FormControl(''),
    reporterLocation: new FormControl(''),
    takePlaceAtAddress: new FormControl(''),
    takePlaceAtLatitude: new FormControl(''),
    takePlaceAtLongitude: new FormControl(''),

    // Body post request
    title: new FormControl(''),
    tag: new FormControl(''),
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

  // Khởi tạo tham số cho để validate data
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
  agency = new FormControl('', [Validators.required]);
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
  placeList = [];
  placeListTown = [];
  placeListVillage = [];
  reporterTypeList: any = [
    { id: 1, name: 'Cá nhân' },
    { id: 2, name: 'Tổ chức' },
    { id: 3, name: 'Khác' },
  ];

  villageList: string[] = ['Phường 10', 'xã Tân Mỹ Chánh'];
  townList: string[] = ['Thành phố Mỹ Tho', 'Châu Thành'];
  provinceList: string[] = ['Tiền Giang', ' Vĩnh Long'];
  provinceId: number;

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  village = new FormControl('Phường 10');
  town = new FormControl('Thành phố Mỹ Tho');
  province = new FormControl('Tiền Giang');

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt'],
  });
  public hasBaseDropZoneOver = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateDialogModel,
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<EditPetitionComponent>,
    private dialog: MatDialog,
    private map: MapboxService,
    private main: SnackbarService,
    private imageCompress: NgxImageCompressService,
    private keycloak: KeycloakService,
    public datepipe: DatePipe
  ) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getPetitionDetail();
    this.getListTag();
    this.getAgency();
    this.getProvince();
    this.map.currentPlace.subscribe(
      (searchedPlace) => (this.searchedPlace = searchedPlace)
    );
    this.map.currentLatitude.subscribe(
      (latitude) => (this.latitude = latitude)
    );
    this.map.currentLongitude.subscribe(
      (longitude) => (this.longitude = longitude)
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
      this.updateForm.controls.reporterPlaceProvince.value
    );
  }

  setValueVillage() {
    let parentId = this.updateForm.controls.reporterPlaceTown.value;
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

  getPetitionDetail() {
    this.service.getPetitionDetail(this.petitionId).subscribe(
      (data) => {
        this.response.push(data);
        console.log(this.response);
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setViewData() {
    let selectedTag = this.response[0].tag;

    let oldReporter = this.response[0].reporter;
    let oldReporterLocation = this.response[0].reporterLocation;

    let publicDescription: string;

    if (this.response[0].isPublic) {
      publicDescription = 'Công khai phản ánh';
    }

    this.updateForm = new FormGroup({
      // Temporary variable
      reporterFullName: new FormControl(oldReporter.fullname),
      reporterPhone: new FormControl(oldReporter.phone),
      reporterIdentityId: new FormControl(oldReporter.identityId),
      reporterType: new FormControl(oldReporter.type),
      reporterFullAddress: new FormControl(oldReporterLocation.fullAddress),
      reporterPlaceVillage: new FormControl('Phường 10'),
      reporterPlaceTown: new FormControl('Thành phố Mỹ Tho'),
      reporterPlaceProvince: new FormControl('Tiền Giang'),
      takePlaceAtAddress: new FormControl(
        this.response[0].takePlaceAt.fullAddress
      ),
      takePlaceAtLatitude: new FormControl(
        this.response[0].takePlaceAt.latitude
      ),
      takePlaceAtLongitude: new FormControl(
        this.response[0].takePlaceAt.longitude
      ),

      // Body post request
      title: new FormControl(this.response[0].title),
      tag: new FormControl('' + this.response[0].tag.id),
      reporter: new FormControl(''),
      reporterLocation: new FormControl(''),
      takePlaceOn: new FormControl(new Date(this.response[0].takePlaceOn)),
      agency: new FormControl('' + this.response[0].agency.id),
      description: new FormControl(this.response[0].description),
      takePlaceAt: new FormControl(this.response[0].takePlaceAt.fullAddress),

      isPublic: new FormControl(publicDescription),
      file: new FormControl(),
      thumbnailId: new FormControl(),
      isAnonymous: new FormControl(),
      receptionMethod: new FormControl(),
    });
  }

  updatePetition(requestBody) {
    this.service.updatePetition(requestBody, this.petitionId).subscribe(
      (data) => {
        // Close dialog, return true
        this.dialogRef.close(true);
      },
      (err) => {
        // Close dialog, return false
        this.dialogRef.close(false);
        // Call api delete file
        console.error(err);
      }
    );
  }

  onConfirm(): void {
    this.keycloak.loadUserProfile().then((user) => {
      // tslint:disable-next-line: no-string-literal
      this.accountId = user['attributes'].user_id;
      this.countDefaultImage = this.uploadedImage.length;
      if (this.countDefaultImage > 0) {
        if (this.files.length > 0) {
          this.service
            .uploadMultiImages(this.files, this.accountId)
            .subscribe((data) => {
              data.forEach((imgInfo) => {
                this.uploadedImage.push(imgInfo.id);
              });
              this.formToJSON();
            });
          // });
        } else {
          this.formToJSON();
        }
      } else {
        if (this.files.length > 0) {
          this.service
            .uploadMultiImages(this.files, this.accountId)
            .subscribe((data) => {
              data.forEach((imgInfo) => {
                this.uploadedImage.push(imgInfo.id);
              });
              this.formToJSON();
            });
        } else {
          this.formToJSON();
        }
      }
    });
  }

  formToJSON() {
    const formObject = this.updateForm.getRawValue();

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
    // if(this.searchedPlace == null) {
    //   this.updateForm.controls.takePlaceAt.setValue(this.searchedPlace);
    // }

    // formObject.reporterFullAddress
    // let updateReporterFullAddress;
    // if (this.searchedPlace == null)
    // let a = formObject.takePlaceAt;
    // console.log(formObject.takePlaceAtLatitude);
    // let b: string;
    if (this.searchedPlace != '') {
      this.updateForm.controls.takePlaceAt.setValue(this.searchedPlace);
    }
    if (this.searchedPlace == '') {
      formObject.takePlaceAt = {
        latitude: formObject.takePlaceAtLatitude,
        longitude: formObject.takePlaceAtLongitude,
        fullAddress: formObject.takePlaceAtAddress,
      };
    } else {
      formObject.takePlaceAt = {
        latitude: this.latitude,
        longitude: this.longitude,
        fullAddress: this.searchedPlace,
      };
    }

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

    console.log(formObject.reporterPlaceProvince);

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
    delete formObject.takePlaceAtLatitude;
    delete formObject.takePlaceAtLongitude;
    delete formObject.takePlaceAtAddress;

    const resultJson = JSON.stringify(formObject, null, 2);

    console.log(resultJson);
    // console.log(this.province);
    this.updatePetition(resultJson);
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
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
export class ConfirmUpdateDialogModel {
  constructor(public title: string, public id: string) {}
}
