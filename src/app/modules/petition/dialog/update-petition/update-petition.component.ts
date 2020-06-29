import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { KeycloakService } from 'keycloak-angular';
import { DatePipe } from '@angular/common';

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
    variables: new FormGroup({
      title: new FormControl(''),
      petitionData: new FormGroup({
        id: new FormControl(''),
        title: new FormControl(''),
        description: new FormControl(''),
        takePlaceAt: new FormGroup({
          latitude: new FormControl(''),
          longitude: new FormControl(''),
          fullAddress: new FormControl('')
        }),
        reporterLocation: new FormControl(''),
        takePlaceOn: new FormControl(''),
        status: new FormControl(''),
        confirm: new FormControl(''),
        workflow: new FormControl(''),
        tag: new FormControl(''),
        file: new FormControl(''),
        reporter: new FormGroup({
          id: new FormControl(''),
          username: new FormControl(''),
          fullname: new FormControl(''),
          phone: new FormControl(''),
          identityId: new FormControl(''),
          type: new FormControl(''),
          address: new FormGroup({
            address: new FormControl(''),
            place: new FormControl('')
          })
        }),
        thumbnailId: new FormControl(''),
        createdDate: new FormControl(''),
        isPublic: new FormControl(''),
        isAnonymous: new FormControl(''),
        result: new FormControl(''),
        processInstanceId: new FormControl(''),
        deploymentId: new FormControl(''),
        agency: new FormControl(''),
        receptionMethod: new FormControl('')
      }),
    }),
    payloadType: new FormControl('')
  });

  update = new FormGroup({
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
    commue: new FormControl(''),
    district: new FormControl(''),
    province: new FormControl('')
  });

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

  petitionId: string;
  processInstanceId: string;
  petition = [];
  checkedIsPublic = false;
  nationId = 1;
  provinceTypeId = 1;
  districtTypeId = 2;
  commueTypeId = 3;
  provinceId: number;
  districtId: number;

  listProvince = [];
  listDistrict = [];
  listCommue = [];
  selectProvince = false;
  selectDistrict = false;
  place = [];

  constructor(public dialogRef: MatDialogRef<UpdatePetitionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdatePetitionDialogModel,
              private service: PetitionService,
              public datepipe: DatePipe,
              private keycloak: KeycloakService) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getDetailPetition();
    console.log(this.petitionId);
    console.log(this.processInstanceId);
    this.getProvince();
  }

  getProvince() {
    this.service.getProvince(this.nationId, this.provinceTypeId).subscribe(data => {
      const size = data.length;
      for (let i = 0; i < size; i++) {
        this.listProvince.push(data[i]);
      }
    });
  }

  getProvinceId(data) {
    this.provinceId = data;
    this.selectProvince = true;
    this.service.getDistrict(this.nationId, this.districtTypeId, this.provinceId).subscribe(info => {
      const size = info.length;
      for (let i = 0; i < size; i++) {
        this.listDistrict.push(info[i]);
      }
    });
  }

  getDistrictId(data) {
    this.districtId = data;
    this.selectDistrict = true;
    this.service.getDistrict(this.nationId, this.commueTypeId, this.districtId).subscribe(info => {
      const size = info.length;
      for (let i = 0; i < size; i++) {
        this.listCommue.push(info[i]);
      }
    });
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  setViewData() {
    if (this.petition[0].processVariables.petitionData.result.isPublic === true) {
      this.checkedIsPublic = true;
    } else {
      this.checkedIsPublic = false;
    }

    let takePlaceOnControl = new FormControl();

    if (this.petition[0].processVariables.petitionData.takePlaceOn != null) {
      takePlaceOnControl = new FormControl(new Date(this.petition[0].processVariables.petitionData.takePlaceOn));
    }
    let positionCommue: string;
    let positionDistrict: string;
    let positionProvince: string;
    this.petition[0].processVariables.petitionData.reporter.address.place.forEach((place, index) => {
      if (place.typeId === 3) {
        positionCommue = index;
      } else {
        if (place.typeId === 2) {
          positionDistrict = index;
        } else {
          positionProvince = index;
        }
      }
    });
    // console.log(this.petition[0].processVariables.petitionData.reporter.address.place[positionCommue].id);
    // console.log(this.petition[0].processVariables.petitionData.reporter.address.place[positionDistrict].id);
    // console.log(this.petition[0].processVariables.petitionData.reporter.address.place[positionProvince].id);

    this.update = new FormGroup({
      title: new FormControl(this.petition[0].processVariables.title),
      takePlaceOn: takePlaceOnControl,
      takePlaceAt: new FormControl(this.petition[0].processVariables.petitionData.takePlaceAt.fullAddress),
      description: new FormControl(this.petition[0].processVariables.petitionData.description),
      isPublic: new FormControl(this.checkedIsPublic),
      name: new FormControl(this.petition[0].processVariables.petitionData.reporter.fullname),
      phone: new FormControl(this.petition[0].processVariables.petitionData.reporter.phone),
      identityId: new FormControl(this.petition[0].processVariables.petitionData.reporter.identityId),
      address: new FormControl(this.petition[0].processVariables.petitionData.reporter.address.address),
      type: new FormControl('' + this.petition[0].processVariables.petitionData.reporter.type),
      commue: new FormControl('' + this.petition[0].processVariables.petitionData.reporter.address.place[positionCommue].id),
      district: new FormControl('' + this.petition[0].processVariables.petitionData.reporter.address.place[positionDistrict].id),
      province: new FormControl('' + this.petition[0].processVariables.petitionData.reporter.address.place[positionProvince].id)
    });
  }

  getDetailPetition() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      this.petition.push(data.list.entries[0].entry);
      console.log(this.petition);
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

    formObj.variables.petitionData.id = this.petition[0].processVariables.petitionData.id;
    formObj.variables.petitionData.reporterLocation = this.petition[0].processVariables.petitionData.reporterLocation;
    formObj.variables.petitionData.status = this.petition[0].processVariables.status;
    formObj.variables.petitionData.confirm = this.petition[0].processVariables.confirm;
    formObj.variables.petitionData.workflow = this.petition[0].processVariables.petitionData.workflow;
    formObj.variables.petitionData.tag = this.petition[0].processVariables.petitionData.tag;
    formObj.variables.petitionData.file = this.petition[0].processVariables.petitionData.file;
    formObj.variables.petitionData.thumbnailId = this.petition[0].processVariables.petitionData.thumbnailId;
    formObj.variables.petitionData.createdDate = this.petition[0].processVariables.petitionData.createdDate;
    formObj.variables.petitionData.isAnonymous = this.petition[0].processVariables.petitionData.isAnonymous;
    formObj.variables.petitionData.processInstanceId = this.petition[0].processVariables.petitionData.processInstanceId;
    formObj.variables.petitionData.deploymentId = this.petition[0].processVariables.petitionData.deploymentId;
    formObj.variables.petitionData.agency = this.petition[0].processVariables.petitionData.agency;
    formObj.variables.petitionData.receptionMethod = this.petition[0].processVariables.petitionData.receptionMethod;

    const a = this.update.getRawValue();
    formObj.variables.title = a.title;
    formObj.variables.petitionData.title = a.title;
    formObj.variables.petitionData.description = a.description;
    formObj.variables.petitionData.isPublic = this.checkedIsPublic;

    formObj.variables.petitionData.takePlaceOn = this.datepipe.transform(a.takePlaceOn, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

    formObj.variables.petitionData.takePlaceAt.latitude = this.petition[0].processVariables.petitionData.takePlaceAt.latitude;
    formObj.variables.petitionData.takePlaceAt.longitude = this.petition[0].processVariables.petitionData.takePlaceAt.longitude;
    formObj.variables.petitionData.takePlaceAt.fullAddress = a.takePlaceAt;

    formObj.variables.petitionData.reporter.id = this.petition[0].processVariables.petitionData.reporter.id;
    formObj.variables.petitionData.reporter.username = this.petition[0].processVariables.petitionData.reporter.username;
    formObj.variables.petitionData.reporter.fullname = a.name;
    formObj.variables.petitionData.reporter.phone = a.phone;
    formObj.variables.petitionData.reporter.identityId = a.identityId;
    formObj.variables.petitionData.reporter.type = a.type;
    formObj.variables.petitionData.reporter.address.address = a.address;
    // formObj.variables.petitionData.reporter.address.place = a.address;

    formObj.variables.petitionData.result = this.petition[0].processVariables.petitionData.result;

    formObj.payloadType = 'SetProcessVariablesPayload';

    const resultJSON = JSON.stringify(formObj, null, 2);
    console.log(resultJSON);
    // this.updateResult(resultJSON);
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

}

export class ConfirmUpdatePetitionDialogModel {
  constructor(public title: string,
              public id: string) { }
}
