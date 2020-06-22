import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { projectIdProcess, typeProcess } from 'src/environments/environment';

@Component({
  selector: 'app-add-process',
  templateUrl: './add-process.component.html',
  styleUrls: ['./add-process.component.scss'],
  providers: [
    DatePipe
  ]
})
export class AddProcessComponent implements OnInit {
  popupTitle: string;
  categoryId = '3';
  listTags = [];
  itemsListTags = [];
  status = 0;
  processDefinitionId: string;

  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  addForm = new FormGroup({
    name: new FormControl(''),
    tag: new FormControl(''),
    process: new FormControl(''),
    status: new FormControl('')
  });
  name = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  processError = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  processList = [];
  listModelProcess = [];
  click = false;
  diagramUrl = '';
  importError?: Error;
  show = false;
  model: any;
  processToDeploy: string;
  checkTag = false;

  constructor(private service: ConfigPetitionService,
              public dialogRef: MatDialogRef<AddProcessComponent>,
              public datepipe: DatePipe,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmAddDialogModel,
              private snackbar: SnackbarService) {
    this.popupTitle = data.name;
  }

  ngOnInit(): void {
    this.getListTags();
    this.getProcess();
  }

  getProcess() {
    this.service.getListModel(projectIdProcess, typeProcess).subscribe(data => {
      this.listModelProcess = data.list;
      const size = this.listModelProcess.entries.length;
      for (let i = 0; i < size; i++) {
        this.processList.push(this.listModelProcess.entries[i].entry);
      }
    });
  }

  public getListTags() {
    this.service.getListTags(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      console.error(err);
    });
  }

  public onConfirm(): void {
    if (this.click === false) {
      this.service.deployModel(this.processToDeploy).subscribe(data => {
        this.model = data.entry;
        this.processDefinitionId = this.model.id;
        this.status = 0;
        this.formToJSON();
      }, err => {
        console.error(err);
      });
    } else {
      if (this.checkTag === false) {
        this.snackbar.openSnackBar('Vui lòng chọn chuyên mục trước khi áp dụng', '', '', '', 'error_notification');
      } else {
        this.service.deployModel(this.processToDeploy).subscribe(data => {
          this.model = data.entry;
          this.processDefinitionId = this.model.id;
          this.status = 1;
          this.formToJSON();
        }, err => {
          console.error(err);
        });
      }
    }
  }

  public onSaveClick(): void {
    this.click = false;
  }

  public onApplyClick(): void {
    this.click = true;
  }

  getProcessDefinitionId(data) {
    this.processToDeploy = data;
    this.show = true;
    this.diagramUrl = this.service.getUrlModel(data);
  }

  checkTags(data) {
    const tagSelect = [];
    tagSelect.push(data);
    if (tagSelect.length === 0) {
      this.checkTag = false;
    } else {
      this.checkTag = true;
    }
  }

  formToJSON() {
    const formObj = this.addForm.getRawValue();

    // Add Tags
    for (const i of formObj.tag) {
      // tslint:disable-next-line: triple-equals
      const item = this.listTags.find(p => p.id == i);
      this.itemsListTags.push(item);
    }
    this.itemsListTags = this.itemsListTags.map(item => {
      delete item.parentId;
      delete item.orderNumber;
      delete item.status;
      delete item.createdDate;
      delete item.description;
      return item;
    });
    formObj.tag = this.itemsListTags;

    // Add process
    formObj.processDefinitionId = this.processDefinitionId;

    // Add status
    formObj.status = this.status;

    // Final result
    const resultJson = JSON.stringify(formObj, null, 2);
    this.postWorkflow(resultJson);
  }

  postWorkflow(requestBody) {
    this.service.postWorkflow(requestBody).subscribe(data => {
      // Close dialog, return true
      let result = {
        body: requestBody,
        data: data
      }
      this.dialogRef.close(result);
    }, err => {
      // Close dialog, return false
      this.dialogRef.close(false);
      // Call api delete file
    });
  }

  drawProcess() {
    this.service.drawProcess();
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }
}

export class ConfirmAddDialogModel {
  constructor(public name: string) {}
}
