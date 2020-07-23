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
import { ImageInfo, UpdateFile } from 'src/app/data/schema/image-info';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { MapboxService } from 'src/app/data/service/mapbox.service';
import { petitionCategoryId } from 'src/app/data/service/config.service';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { KeycloakService } from 'keycloak-angular';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { typeArrImg, typeFile } from 'src/environments/environment';

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
  username: string;
  progress: number = 0;

  // Upload file
  uploaded: boolean;
  blankVal: any;
  // uploadedImage = [];
  uploadedImage: UpdateFile[] = [];
  countDefaultImage;
  listTags = [];
  itemTagList = [];
  files = [];
  filesInfo = [];
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
    petitionFullAddress: new FormControl(''),
    petitionLatitude: new FormControl(''),
    petitionLongitude: new FormControl(''),

    // Body post request
    title: new FormControl(''),
    tag: new FormControl(''),
    reporter: new FormControl(''),
    takePlaceOn: new FormControl(''),
    agency: new FormControl(''),
    description: new FormControl(''),
    takePlaceAt: new FormControl(''),
    sendSms: new FormControl(''),
    isPublic: new FormControl(''),
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
  public typeImg = [];
  public hasBaseDropZoneOver = false;
  typeFile = [];
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
    this.typeFile = typeFile;
    this.typeImg = typeArrImg;
    this.getUserProfile();
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

  getUserProfile(): void {
    this.keycloak.loadUserProfile().then((user) => {
      this.accountId = user['attributes'].user_id;
      this.username = user.username;
    });
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
    return this.getTown(this.updateForm.controls.reporterPlaceProvince.value);
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
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  setViewData() {
    let oldReporter = this.response[0].reporter;

    let publicDescription: string;

    if (this.response[0].isPublic) {
      publicDescription = 'Công khai phản ánh';
    }

    let address = {
      address: '',
      place: [{ id: '' }, { id: '' }, { id: '' }],
    };

    if (this.response[0].reporter.address != undefined) {
      address = this.response[0].reporter.address;
      this.getTown(this.response[0].reporter.address.place[2].id);
      this.getVillage(this.response[0].reporter.address.place[1].id);
    }

    let agencyId = '';
    if (this.response[0].agency != undefined) {
      agencyId = this.response[0].agency.id;
    }

    this.response[0].reporter.address;

    this.updateForm = new FormGroup({
      // Temporary variable
      reporterFullName: new FormControl(oldReporter.fullname),
      reporterPhone: new FormControl(oldReporter.phone),
      reporterIdentityId: new FormControl(oldReporter.identityId),
      reporterType: new FormControl(oldReporter.type),
      reporterFullAddress: new FormControl(address.address),
      reporterPlaceVillage: new FormControl(address.place[0].id),
      reporterPlaceTown: new FormControl(address.place[1].id),
      reporterPlaceProvince: new FormControl(address.place[2].id),
      petitionFullAddress: new FormControl(
        this.response[0].takePlaceAt.fullAddress
      ),
      petitionLatitude: new FormControl(this.response[0].takePlaceAt.latitude),
      petitionLongitude: new FormControl(
        this.response[0].takePlaceAt.longitude
      ),

      // Body post request
      title: new FormControl(this.response[0].title),
      tag: new FormControl('' + this.response[0].tag.id),
      reporter: new FormControl(''),
      reporterLocation: new FormControl(''),
      takePlaceOn: new FormControl(new Date(this.response[0].takePlaceOn)),
      agency: new FormControl('' + agencyId),
      description: new FormControl(this.response[0].description),
      takePlaceAt: new FormControl(this.response[0].takePlaceAt.fullAddress),
      isPublic: new FormControl(publicDescription),
      file: new FormControl(),
      thumbnailId: new FormControl(this.response[0].thumbnailId),
      isAnonymous: new FormControl(this.response[0].isAnonymous),
      receptionMethod: new FormControl(this.response[0].receptionMethod),
    });

    this.response[0].file.forEach((item) => {
      let temp = {
        id: item.id,
        name: item.name,
        group: item.group,
        updateDate: this.datepipe.transform(
          new Date(),
          "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        ),
      };
      this.uploadedImage.push(temp);
    });

    this.countDefaultImage = this.uploadedImage.length;

    if (this.response[0].file.length > 0) {
      for (let i of this.response[0].file) {
        let urlResult: any;
        let fileName = '';
        let fileNamesFull = '';

        this.service.getImage(i.id).subscribe(
          (data) => {
            const reader = new FileReader();
            reader.addEventListener(
              'load',
              () => {
                urlResult = reader.result;
                this.service.getImageName_Size(i.id).subscribe(
                  (data: any) => {
                    if (data.filename.length > 20) {
                      // Tên file quá dài
                      const startText = data.filename.substr(0, 5);
                      const shortText = data.filename.substr(
                        data.filename.length - 7,
                        data.filename.length
                      );
                      fileName = startText + '...' + shortText;
                      // Tên file gốc - hiển thị tooltip
                      fileNamesFull = data.filename;
                    } else {
                      fileName = data.filename;
                      fileNamesFull = data.filename;
                    }
                    this.filesInfo.push({
                      id: i,
                      url: i.group[0] == 1 ? urlResult : i.group[0] == 2 ? this.typeImg[0].url : i.group[0] == 3 ? this.typeImg[1].url : null,
                      name: fileName,
                      fullName: fileNamesFull,
                    });
                  },
                  (err) => {
                    console.error(err);
                  }
                );
              },
              false
            );
            reader.readAsDataURL(data);
          },
          (err) => {
            console.error(err);
          }
        );
      }
    }
    this.uploaded = true;

    this.searchedPlace = this.response[0].takePlaceAt.fullAddress;
    this.longitude = this.response[0].takePlaceAt.longitude;
    this.latitude = this.response[0].takePlaceAt.latitude;
  }

  updatePetition(requestBody) {
    console.log(requestBody);
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
    this.formToJSON();
  }

  formToJSON() {
    const formObject = this.updateForm.getRawValue();


    // Tag
    const selectedTag = formObject.tag;
    formObject.tag = this.tagList.find((p) => p.id == selectedTag);
    delete formObject.tag.parentId;
    delete formObject.tag.orderNumber;
    delete formObject.tag.status;
    delete formObject.tag.createdDate;
    delete formObject.tag.description;
    delete formObject.tag.iconId;

    // Format takePlaceOn
    formObject.takePlaceOn = this.datepipe.transform(
      formObject.takePlaceOn,
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    );

    // Add agency
    const selectedAgency = formObject.agency;
    formObject.agency = this.agencyList.find((p) => p.id == selectedAgency);
    delete formObject.agency.logoId;

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
      fullAddress: formObject.reporterFullAddress,
    };

    // reporter
    let province = this.placeList.find(
      (p) => p.id == formObject.reporterPlaceProvince
    );
    let town = this.placeListTown.find(
      (p) => p.id == formObject.reporterPlaceTown
    );
    let village = this.placeListVillage.find(
      (p) => p.id == formObject.reporterPlaceVillage
    );

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
    this.updatePetition(resultJson);
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  openMapDialog(address, long, lat) {
    this.service.openMapDialog(address, { longitude: long, latitude: lat });
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

  isFileImage(file) {
    const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type']);
  }
  isFileVideo(file) {
    const acceptedImageTypes = ['video/mp4', 'video/MPEG-4', 'video/AVI', 'video/OGM', 'video/MPG', 'video/WMV'];
    return file && acceptedImageTypes.includes(file['type'])
  }
  isFileAudio(file) {
    const acceptedImageTypes = ['audio/mpeg'];
    return file && acceptedImageTypes.includes(file['type'])
  }
  // File uploads
  onSelectFile(event) {
    let i = 0;
    let files = [];
    let fileImport;
    if (event.target.files.length >= 1) {
      if (this.isFileImage(event.target.files[0])) {
        if (event.target.files && event.target.files[0]) {
          for (const file of event.target.files) {
            // =============================================
            let urlNone: any;
            let urlResult: any;
            let fileName = '';
            let fileNamesFull = '';

            // =============================================
            const reader = new FileReader();
            reader.onload = (eventLoad) => {
              this.uploaded = true;
              urlNone = eventLoad.target.result;
              this.imageCompress
                .compressFile(urlNone, -1, 75, 50)
                .then((result) => {
                  this.urlPreview = result;
                  urlResult = result.split(',')[1];
                  this.fileImport = this.convertBase64toFile(result, file.name);
                  fileImport = this.convertBase64toFile(result, file.name);
                  if (this.filesInfo.length < 5) {
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
                      fileName = startText + '...' + shortText;
                      // Tên file gốc - hiển thị tooltip
                      fileNamesFull = event.target.files[i].name;
                    } else {
                      fileName = this.fileImport.name;
                      fileNamesFull = this.fileImport.name;
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
      } else if (this.isFileVideo(event.target.files[0])) {
        fileImport = event.target.files[0];
        files.push(fileImport);
        const startText = event.target.files[i].name.substr(0, 5);
        const shortText = event.target.files[i].name.substring(
          event.target.files[i].name.length - 7,
          event.target.files[i].name.length
        );
        this.fileNames.push(startText + '...' + shortText);
        this.uploadImages1(files);
      } else if (this.isFileAudio(event.target.files[0])) {
        console.log("audido");
        fileImport = event.target.files[0];
        files.push(fileImport);
        const startText = event.target.files[i].name.substr(0, 5);
        // tslint:disable-next-line:max-line-length
        const shortText = event.target.files[i].name.substring(
          event.target.files[i].name.length - 7,
          event.target.files[i].name.length
        );
        this.fileNames.push(startText + '...' + shortText);
        this.uploadImages2(files);
      } else {
        this.main.openSnackBar(
          'File không phải ảnh, ',
          '',
          'vui lòng thêm lại',
          '',
          'error_notification'
        );
      }
    }
  }
  uploadImages(files) {
    this.countDefaultImage = this.uploadedImage.length;
    if (this.countDefaultImage > 0) {
      if (files.length > 0) {
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
                    group: [1],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp);
                  this.filesInfo.push({
                    id: temp,
                    url: this.urlPreview,
                    name: imgInfo.filename,
                    fullName: imgInfo.filename,
                  });
                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
      }
    } else {
      if (files.length > 0) {
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
                    group: [1],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp);
                  this.filesInfo.push({
                    id: temp,
                    url: this.urlPreview,
                    name: imgInfo.filename,
                    fullName: imgInfo.filename,
                  });
                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
      }
    }

  }
  uploadImages1(files) {
    this.countDefaultImage = this.uploadedImage.length;
    if (this.countDefaultImage > 0) {
      if (files.length > 0) {
        this.service
          .uploadMultiImages(files, this.accountId)
          .subscribe((event: HttpEvent<any>) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                this.progress = Math.round((event.loaded / event.total) * 100);
                break;
              case HttpEventType.Response:
                console.log(event.body);
                event.body.forEach((imgInfo) => {
                  let temp1 = {
                    id: imgInfo.id,
                    name: imgInfo.filename,
                    group: [2],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp1);
                  this.filesInfo.push({ url: this.typeImg[1].url, temp: temp1, fullName: imgInfo.filename, name: imgInfo.filename });

                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
      }
    } else {
      if (files.length > 0) {
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
                    group: [2],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp);
                  this.filesInfo.push({ url: this.typeImg[1].url, temp: temp, fullName: imgInfo.filename, name: imgInfo.filename });
                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
      }
    }

  }
  uploadImages2(files) {
    this.countDefaultImage = this.uploadedImage.length;
    if (this.countDefaultImage > 0) {
      if (files.length > 0) {
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
                    group: [3],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp);
                  this.filesInfo.push({ url: this.typeImg[1].url, temp: temp, fullName: imgInfo.filename, name: imgInfo.filename });

                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
      }
    } else {
      if (files.length > 0) {
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
                    group: [3],
                    updateDate: this.datepipe.transform(
                      new Date(),
                      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
                    ),
                  };
                  this.uploadedImage.push(temp);
                  this.filesInfo.push({ url: this.typeImg[1].url, temp: temp, fullName: imgInfo.filename, name: imgInfo.filename });

                });
                setTimeout(() => {
                  this.progress = 0;
                }, 1500);
            }
          });
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
  removeItem(id, i) {
    this.service.deleteImage(id).subscribe((data) => {
      this.filesInfo.splice(i, 1);
      this.files.splice(i, 1);
      this.blankVal = '';
    })
  }
}
export class ConfirmUpdateDialogModel {
  constructor(public title: string, public id: string) { }
}
