import { Component, OnInit, Inject, Input } from '@angular/core';
import { PetitionService } from 'src/app/data/service/petition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { KeycloakService } from 'keycloak-angular';
import { FormGroup, FormControl, FormControlName } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-confirmation-completed',
  templateUrl: './confirmation-completed.component.html',
  styleUrls: ['./confirmation-completed.component.scss']
})
export class ConfirmationCompletedComponent implements OnInit {

  isLinear = true;
  checkedStep1: string;
  checkedStep2 = false;
  submit = 2;
  petitionId: string;
  exclusive: boolean;
  outGoingFlow = [];
  requestBody = [];
  body = new FormGroup({});
  formTemplate: any;

  select: string;
  commonArray = [];

  constructor(private service: PetitionService,
              public dialogRef: MatDialogRef<ConfirmationCompletedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmationCompletedPetitionDialogModel,
              public keycloak: KeycloakService) {
    this.petitionId = data.id;
  }

  splitString(str) {
    const a = str.split('${', 2)[1];
    const b = a.split('==true}', 2)[0];
    return b;
  }

  splitValue(str) {
    const a = str.split('==', 2)[1];
    const b = a.split('}', 2)[0];
    return b;
  }

  ngOnInit(): void {
    this.getNextFlow();

    let variables = {};
    this.commonArray.forEach(e => {
      variables[this.splitString(e)] = new FormControl('');
    });
    this.body = new FormGroup(variables);

  }

  getNextFlow() {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      // console.log(data.list.entries[0].entry.id);
      this.service.getNextFlow(taskId).subscribe(res => {
        // console.log(res[0].targetNode.detail.outgoingFlows);
        this.exclusive = res[0].targetNode.detail.exclusive;
        this.outGoingFlow = res[0].targetNode.detail.outgoingFlows;
        // console.log(res[0].targetNode.detail.outgoingFlows[0].conditionExpression);
        // console.log(this.outGoingFlow);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }



  isCommonElt(name: any): boolean {
    return this.commonArray.some(elt => elt.name === name);
  }

  setValue(name) {
    const obj = this.outGoingFlow.filter(x => x.name === name)[0];
    if (this.outGoingFlow.some(x => x.name === name)) {
      this.requestBody.unshift(obj.conditionExpression);
      // console.log('đã chọn => ' + this.requestBody[0]);
    }
    this.select = this.splitString(this.requestBody[0]);
    console.log('chuỗi đã cắt => ' + this.select);
  }

  formToJson() {
    const formObj = this.body.getRawValue();

    formObj.payloadType = 'SetProcessVariablesPayload';
    const resultJson = JSON.stringify(formObj, null, 2);
    console.log(resultJson);
    // this.postVariable(resultJson);
  }

  postVariable(requestBody) {
    this.service.getDetailPetition(this.petitionId).subscribe(data => {
      const processInstancesId = data.list.entries[0].entry.processInstancesId;
      this.service.postVariable(processInstancesId, requestBody).subscribe(res => {
        console.log(res);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });

  }

  getCheckboxes(event, value) {
    const a = this.splitString(value);
    if (event.checked) {
      this.commonArray.push(value);
    }
    if (!event.checked) {
      const index = this.commonArray.indexOf(value);
      if (index > -1) {
        this.commonArray.splice(index, 1);
      }
    }
    console.log(this.commonArray);
    this.formToJson();
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

}

export class ConfirmationCompletedPetitionDialogModel {
  constructor(public title: string,
              public id: string) { }
}
