import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { projectIdProcess, typeProcess } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-update-process',
  templateUrl: './update-process.component.html',
  styleUrls: ['./update-process.component.scss']
})
export class UpdateProcessComponent implements OnInit {
  workflowId: string;
  categoryId = '3';
  listTags = [];
  itemsListTags = [];
  response = [];
  status: number;
  click = false;
  processDefinitionId: string;

  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  updateForm = new FormGroup({
    name: new FormControl(''),
    tag: new FormControl(''),
    process: new FormControl(''),
    status: new FormControl('')
  });
  name = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);
  processError = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  processList = [];
  listModelProcess = [];
  svgIcon: any;
  diagramUrl = '';
  importError?: Error;
  show = false;
  model: any;
  processToDeploy: string;
  checkTag = false;
  processAvailable: string;
  idUnchange: string;

  constructor(private service: ConfigPetitionService,
              public dialogRef: MatDialogRef<UpdateProcessComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConfirmUpdateDialogModel,
              private snackbar: SnackbarService,
              private sanitizer: DomSanitizer) {
    this.workflowId = data.id;
  }

  ngOnInit(): void {
    this.getListTags();
    this.getWorkflowDetail();
    this.getProcess();
    this.getModel();
  }

  getIdModel(nameModel: string, modelList: any[]) {
    let count = 0;
    modelList.forEach(model => {
      if (model.name === nameModel) {
        this.processAvailable = model.id;
        count = count + 1;
      }
    });
    if (count === 1) {
      return true;
    } else {
      return false;
    }
  }

  getModel() {
    this.service.getWorkflowDetail(this.workflowId).subscribe(data => {
      this.service.getModelDeploy(data.processDefinitionId).subscribe(model => {
        const blob = new Blob([model], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        this.svgIcon = this.sanitizer.bypassSecurityTrustUrl(url);
      });
    });
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

  getWorkflowDetail() {
    this.service.getWorkflowDetail(this.workflowId).subscribe(data => {
      this.response.push(data);
      this.setViewData();
    }, err => {
      console.error(err);
    });
  }

  setViewData() {
    let tagSelected = [];
    for (const item of this.response[0].tag) {
      tagSelected.push(item.id);
    }
    tagSelected = tagSelected.map(String);

    let proSelect: string;
    this.service.getIdModel(this.response[0].processDefinitionId).subscribe(info => {
      proSelect = info.entry.name;
      if (this.getIdModel(proSelect, this.processList) === true) {
        this.updateForm = new FormGroup({
          name: new FormControl(this.response[0].name),
          tag: new FormControl(tagSelected),
          process: new FormControl('' + this.processAvailable),
          status: new FormControl(this.response[0].status)
        });
      }
    });
  }

  updateWorkflow(requestBody) {
    this.service.updateWorkflow(requestBody, this.workflowId).subscribe(data => {
      // Close dialog, return true
      this.dialogRef.close(true);
    }, err => {
      // Close dialog, return false
      this.dialogRef.close(false);
      // Call api delete file
      console.error(err);
    });
  }

  formToJSON() {
    const formObj = this.updateForm.getRawValue();

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
    this.updateWorkflow(resultJson);
  }

  getValueModel(idModel: string, modelList: any[]) {
    let count = 0;
    modelList.forEach(model => {
      if (model.id !== idModel) {
        count = count + 1;
        this.idUnchange = idModel;
      }
    });
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }

  public onConfirm(): void {
    if (this.click === false) {
      this.service.getWorkflowDetail(this.workflowId).subscribe(data => {
        this.service.getIdModel(data.processDefinitionId).subscribe(info => {
          if (this.getValueModel(info.entry.id, this.processList) === true) {
            this.processDefinitionId = this.idUnchange;
            if (data.status === 0) {
              this.status = 0;
              this.formToJSON();
            } else {
              if (data.status === 1) {
                this.status = 1;
                this.formToJSON();
              } else {
                this.status = 2;
                this.formToJSON();
              }
            }
          } else {
            this.service.deployModel(this.processToDeploy).subscribe(model => {
              this.model = model.entry;
              this.processDefinitionId = this.model.id;
              if (data.status === 0) {
                this.status = 0;
                this.formToJSON();
              } else {
                if (data.status === 1) {
                  this.status = 1;
                  this.formToJSON();
                } else {
                  this.status = 2;
                  this.formToJSON();
                }
              }
            }, err => {
              console.error(err);
            });
          }
        });
      });
    } else {
      if (this.checkTag === false) {
        this.snackbar.openSnackBar('Vui lòng chọn chuyên mục trước khi áp dụng', '', '', '', 'error_notification');
      } else {
        this.service.getWorkflowDetail(this.workflowId).subscribe(wf => {
          this.service.getIdModel(wf.processDefinitionId).subscribe(info => {
            if (this.getValueModel(info.entry.id, this.processList) === true) {
              this.processDefinitionId = this.idUnchange;
              this.status = 1;
              this.formToJSON();
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
          });
        });

      }
    }
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

  public onSaveClick(): void {
    this.click = false;
  }

  public onApplyClick(): void {
    this.click = true;
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  drawProcess() {
    this.service.drawProcess();
  }

}

export class ConfirmUpdateDialogModel {
  constructor(public title: string,
              public id: string) { }
}
