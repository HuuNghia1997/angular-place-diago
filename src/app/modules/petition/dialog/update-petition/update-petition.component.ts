import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { DatePipe } from '@angular/common';
import { environment } from 'env/environment';
import { MapboxService } from 'src/app/data/service/mapbox.service';

@Component({
  selector: 'app-update-petition',
  templateUrl: './update-petition.component.html',
  styleUrls: ['./update-petition.component.scss'],
  providers: [
    {
      provide: NgxMatDateAdapter,
      useClass: PickDatetimeAdapter
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    },
    DatePipe
  ]
})
export class UpdatePetitionComponent implements OnInit {
  updateForm = new FormGroup({
    title: new FormControl(''),
    takePlaceOn: new FormControl(''),
    takePlaceAt: new FormControl(''),
    description: new FormControl(''),
    isPublic: new FormControl(''),
    name: new FormControl(''),
    phone: new FormControl(''),
    identityId: new FormControl(''),
    address: new FormControl(''),
    type: new FormControl(''),
    village: new FormControl(''),
    district: new FormControl(''),
    province: new FormControl(''),
    petitionLatitude: new FormControl(''),
    petitionLongitude: new FormControl('')
  });
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  title = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  takePlaceOn = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  takePlaceAt = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  description = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  name = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  phone = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  @ViewChild('picker') picker: any;
  @ViewChild('pickerOccurred') pickerOccurred: any;
  @ViewChild('pickerCreate') pickCreate: any;

  public dates: Date;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  taskId: string;
  petitionId: string;
  processInstanceId: string;
  petition = [];
  checkedIsPublic = false;
  nationId = 1;
  provinceTypeId = 1;
  districtTypeId = 2;
  villageTypeId = 3;
  provinceId: number;
  districtId: number;
  address: string;
  latitude: string;
  longitude: string;

  listProvince = [];
  listDistrict = [];
  listVillage = [];
  selectProvince = false;
  selectDistrict = false;
  place = [];

  listTypeReporter = [
    { id: 1, name: 'Cá nhân' },
    { id: 2, name: 'Tổ chức' },
    { id: 3, name: 'Khác' }
  ];

  constructor(public dialogRef: MatDialogRef<UpdatePetitionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdatePetitionDialogModel,
              private service: PetitionService,
              public datepipe: DatePipe,
              private map: MapboxService) {
    this.taskId = data.taskId;
  }

  ngOnInit(): void {
    this.getDetailPetition();
    this.getProvince();
    this.map.currentPlace.subscribe((searchedPlace) =>
      this.updateForm.controls.takePlaceAt.setValue(searchedPlace)
    );
    this.map.currentLatitude.subscribe((latitude) =>
      this.updateForm.controls.petitionLatitude.setValue(latitude)
    );
    this.map.currentLongitude.subscribe((longitude) =>
      this.updateForm.controls.petitionLongitude.setValue(longitude)
    );
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  public getProvince() {
    this.service.getProvince(this.nationId, this.provinceTypeId).subscribe(data => {
      data.forEach((item) => {
        this.listProvince.push(item);
      });
    });
  }

  public getDistrict(provinceId) {
    this.resetListDistrict();
    this.resetListVillage();
    this.service.getDistrict(this.nationId, this.districtTypeId, provinceId).subscribe(data => {
      data.forEach((item) => {
        this.listDistrict.push(item);
      });
    });
  }

  public getVillage(districtId) {
    this.resetListVillage();
    this.service.getDistrict(this.nationId, this.villageTypeId, districtId).subscribe(data => {
      data.forEach((item) => {
        this.listVillage.push(item);
      });
    });
  }

  setValueDistrict() {
    this.getDistrict(this.updateForm.controls.province.value);
  }

  setValueVillage() {
    this.getVillage(this.updateForm.controls.district.value);
  }

  resetListDistrict() {
    this.listDistrict = [];
  }

  resetListVillage() {
    this.listVillage = [];
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  setViewData() {
    if (this.petition[0].taskLocalVariables.isPublic === false) {
      this.checkedIsPublic = false;
    } else {
      this.checkedIsPublic = true;
    }

    const place = this.petition[0].taskLocalVariables.petitionData.reporter.address.place;
    let provinceId;
    let districtId;
    let villageId;
    if ( place.find(p => p.typeId === 1) !== undefined) {
      provinceId = place.find(p => p.typeId === 1).id;
    }
    if ( place.find(p => p.typeId === 2) !== undefined) {
      districtId = place.find(p => p.typeId === 2).id;
    }
    if ( place.find(p => p.typeId === 3) !== undefined) {
      villageId = place.find(p => p.typeId === 3).id;
    }
    this.updateForm = new FormGroup({
      title: new FormControl(this.petition[0].taskLocalVariables.petitionData.title),
      takePlaceOn: new FormControl(new Date(this.petition[0].taskLocalVariables.petitionData.takePlaceOn)),
      takePlaceAt: new FormControl(this.petition[0].taskLocalVariables.petitionData.takePlaceAt.fullAddress),
      description: new FormControl(this.petition[0].taskLocalVariables.petitionData.description),
      isPublic: new FormControl(this.checkedIsPublic),
      name: new FormControl(this.petition[0].taskLocalVariables.petitionData.reporter.fullname),
      phone: new FormControl(this.petition[0].taskLocalVariables.petitionData.reporter.phone),
      identityId: new FormControl(this.petition[0].taskLocalVariables.petitionData.reporter.identityId),
      address: new FormControl(this.petition[0].taskLocalVariables.petitionData.reporter.address.address),
      type: new FormControl('' + this.petition[0].taskLocalVariables.petitionData.reporter.type),
      village: new FormControl('' + villageId),
      district: new FormControl('' + districtId),
      province: new FormControl('' + provinceId),
      petitionLatitude: new FormControl(this.petition[0].taskLocalVariables.petitionData.takePlaceAt.latitude),
      petitionLongitude: new FormControl(this.petition[0].taskLocalVariables.petitionData.takePlaceAt.longitude),
    });

    this.getDistrict(provinceId);
    this.getVillage(districtId);

    this.address = this.petition[0].taskLocalVariables.petitionData.takePlaceAt.fullAddress;
    this.latitude = this.petition[0].taskLocalVariables.petitionData.takePlaceAt.latitude;
    this.longitude = this.petition[0].taskLocalVariables.petitionData.takePlaceAt.longitude;
  }

  getDetailPetition() {
    this.service.getDetailPetition(this.taskId).subscribe(data => {
      this.petition.push(data.entry);
      this.setViewData();
    }, err => {
      console.log(err);
    });
  }

  updateResult(requestBody) {
    this.service.postVariable(this.taskId, requestBody).subscribe(res => {
      this.dialogRef.close(true);
    }, err => {
      this.dialogRef.close(false);
      console.error(err);
    });
  }

  formToJson() {
    const formObj = this.updateForm.getRawValue();
    formObj.payloadType = 'UpdateTaskVariablePayload';
    formObj.taskId = this.taskId;
    // Value
    formObj.value = {};
    formObj.value.id = this.petition[0].taskLocalVariables.petitionData.id;
    formObj.value.title = formObj.title;
    formObj.value.description = formObj.description;
    // takePlaceAt
    formObj.value.takePlaceAt = {};
    formObj.value.takePlaceAt.latitude = formObj.petitionLatitude;
    formObj.value.takePlaceAt.longitude = formObj.petitionLongitude;
    formObj.value.takePlaceAt.fullAddress = formObj.takePlaceAt;
    // reporterLocation
    formObj.value.reporterLocation = {};
    formObj.value.reporterLocation.latitude = this.petition[0].taskLocalVariables.petitionData.reporterLocation.latitude;
    formObj.value.reporterLocation.longitude = this.petition[0].taskLocalVariables.petitionData.reporterLocation.longitude;
    formObj.value.reporterLocation.fullAddress = formObj.address;
    // takePlaceOn
    formObj.value.takePlaceOn = this.datepipe.transform(formObj.takePlaceOn, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    // status
    formObj.value.status = this.petition[0].taskLocalVariables.petitionData.status;
    // confirm
    formObj.value.confirm = this.petition[0].taskLocalVariables.petitionData.confirm;
    // tag
    formObj.value.tag = this.petition[0].taskLocalVariables.petitionData.tag;
    // file
    formObj.value.file = this.petition[0].taskLocalVariables.petitionData.file;
    // reporter
    formObj.value.reporter = {};
    formObj.value.reporter.id = this.petition[0].taskLocalVariables.petitionData.reporter.id;
    formObj.value.reporter.username = this.petition[0].taskLocalVariables.petitionData.reporter.username;
    formObj.value.reporter.fullname = formObj.name;
    formObj.value.reporter.phone = formObj.phone;
    formObj.value.reporter.identityId = formObj.identityId;
    formObj.value.reporter.type = Number(formObj.type);
    formObj.value.reporter.address = {};
    formObj.value.reporter.address.address = formObj.address;

    if (formObj.province != '') {
      let province = {
        id: 1,
        typeId: 1,
        name: ''
      };
      formObj.province = this.listProvince.find(p => p.id === Number(formObj.province));
      console.log(formObj.province);
      if (formObj.province !== undefined) {
        province = formObj.province;
        province.typeId = 1;
        this.place.push(province);
      }
    }

    if (formObj.district != '') {
      let district = {
        id: 1,
        typeId: 2,
        name: ''
      };
      formObj.district = this.listDistrict.find(p => p.id === Number(formObj.district));
      if (formObj.district !== undefined) {
        district = formObj.district;
        district.typeId = 2;
        this.place.push(district);
      }
    }

    if (formObj.village != '') {
      let village = {
        id: 1,
        typeId: 3,
        name: ''
      };
      formObj.village = this.listVillage.find(p => p.id === Number(formObj.village));
      if (formObj.village !== undefined) {
        village = formObj.village;
        village.typeId = 3;
        this.place.push(village);
      }
    }

    formObj.value.reporter.address.place = this.place;
    // thumbnailId
    formObj.value.thumbnailId = this.petition[0].taskLocalVariables.petitionData.thumbnailId;
    // createdDate
    formObj.value.createdDate = this.petition[0].taskLocalVariables.petitionData.createdDate;
    // isPublic
    formObj.value.isPublic = this.checkedIsPublic;
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
    formObj.value.result = this.petition[0].taskLocalVariables.petitionData.result;

    // Hide element
    delete formObj.title;
    delete formObj.description;
    delete formObj.petitionLatitude;
    delete formObj.petitionLongitude;
    delete formObj.takePlaceAt;
    delete formObj.address;
    delete formObj.takePlaceOn;
    delete formObj.name;
    delete formObj.phone;
    delete formObj.identityId;
    delete formObj.type;
    delete formObj.province;
    delete formObj.district;
    delete formObj.village;
    delete formObj.isPublic;

    const resultJSON = JSON.stringify(formObj, null, 2);
    console.log(resultJSON);
    this.updateResult(resultJSON);
  }

  onSubmit() {
    this.formToJson();
  }

  checkPublic(event) {
    if (event.checked === true) {
      this.checkedIsPublic = true;
    } else {
      this.checkedIsPublic = false;
    }
  }

  openMapDialog(address, long, lat) {
    this.service.openMapDialog(address, { longitude: long, latitude: lat });
  }

}

export class ConfirmUpdatePetitionDialogModel {
  constructor(public title: string,
              public taskId: string) { }
}
