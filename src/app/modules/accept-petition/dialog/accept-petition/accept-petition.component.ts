import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { WorkflowDiagramComponent } from 'src/app/modules/accept-petition/dialog/workflow-diagram/workflow-diagram.component';

@Component({
  selector: 'app-accept-petition',
  templateUrl: './accept-petition.component.html',
  styleUrls: ['./accept-petition.component.scss'],
})
export class AcceptPetitionComponent implements OnInit {
  // Initialization
  petition = [];
  petitionId: string;
  petitionTitle: string;
  tagId: number;
  workflowList = [];

  // Set form control
  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  acceptForm = new FormGroup({
    workflowId: new FormControl(''),
    content: new FormControl(''),
    sendSms: new FormControl(''),
    isPublic: new FormControl(''),
  });
  workflowId = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmAcceptDialogModel,
    public dialogRef: MatDialogRef<AcceptPetitionComponent>,
    private service: AcceptPetitionService,
    private dialog: MatDialog
  ) {
    this.petitionId = data.id;
  }

  ngOnInit(): void {
    this.getPetitionDetail();
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  getPetitionDetail() {
    this.service.getPetitionDetail(this.petitionId).subscribe(
      (data) => {
        this.petition.push(data);
        this.setViewData();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getWorkflow(tagId) {
    this.service.getWorkflow(tagId).subscribe((data) => {
      data.forEach((item) => {
        this.workflowList.push(item);
      });
    });
  }

  setViewData() {
    this.petitionTitle = this.petition[0].title;
    this.tagId = this.petition[0].tag.id;
    this.getWorkflow(this.petition[0].tag.id);

    let smsDescription: string;
    let publicDescription: string;

    if (this.petition[0].sendSms) {
      smsDescription = 'Gửi tin nhắn SMS';
    }

    if (this.petition[0].isPublic) {
      publicDescription = 'Công khai phản ánh';
    }

    this.acceptForm = new FormGroup({
      workflowId: new FormControl(''),
      content: new FormControl(''),
      sendSms: new FormControl(smsDescription),
      isPublic: new FormControl(publicDescription),
    });
  }

  postProcessInstances(requestBody) {
    this.service.postProcessInstances(this.petitionId, requestBody).subscribe(
      (data) => {
        // Close dialog, return true
        let result = {
          body: requestBody,
          data: data,
        };
        // this.dialogRef.close(result);
      },
      (err) => {
        // Close dialog, return false
        this.dialogRef.close(false);
        // Call api delete file
      }
    );
  }

  acceptPetition(requestBody) {
    this.service.acceptPetition(requestBody, this.petitionId).subscribe(
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

  // Add comment
  comment(requestBody) {
    this.service.commentPetition(requestBody);
  }

  setFormObject() {
    const formObject = this.acceptForm.getRawValue();

    const selectedWorkflowId = formObject.workflowId;
    let selectedWorkflow = this.workflowList.find(
      (p) => p.id == selectedWorkflowId
    );
    formObject.workflowName = selectedWorkflow.name;
    formObject.processDefinitionId = selectedWorkflow.processDefinitionId;

    // Set sendSms
    if (formObject.sendSms) {
      formObject.sendSms = true;
    } else {
      formObject.sendSms = false;
    }

    // Set public
    if (formObject.isPublic) {
      formObject.isPublic = true;
    } else {
      formObject.isPublic = false;
    }

    // Set comment
    let commentObject = {
      groupId: 1,
      itemId: this.petitionId,
      user: {
        id: this.petition[0].reporter.id,
        fullname: this.petition[0].reporter.fullname,
      },
      content: formObject.content,
    };
    const resultJson = JSON.stringify(commentObject, null, 2);

    // Set process Instances
    let processInstancesObject = {
      processDefinitionId: selectedWorkflow.processDefinitionId,
      payloadType: 'StartProcessPayload',
      variables: {
        title: this.petitionTitle,
        petitionData: this.petition[0],
      },
      commandType: 'StartProcessInstanceCmd',
    };

    this.comment(commentObject);
    // this.postProcessInstances(processInstancesObject);
    this.acceptPetition(formObject);
  }

  onConfirm(): void {
    this.setFormObject();
  }

  onDismiss(): void {
    // Close dialog
    this.dialogRef.close();
  }

  openWorkflowDiagramDialog(id, name): void {
    this.service.openWorkflowDiagramDialog(id, name);
  }
}

export class ConfirmAcceptDialogModel {
  constructor(
    public title: string,
    public message: string,
    public id: string
  ) {}
}
