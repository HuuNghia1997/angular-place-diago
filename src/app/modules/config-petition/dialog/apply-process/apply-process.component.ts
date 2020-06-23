import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-apply-process',
  templateUrl: './apply-process.component.html',
  styleUrls: ['./apply-process.component.scss']
})
export class ApplyProcessComponent implements OnInit {

  isLinear = true;
  message: string;
  id: string;
  workflowName: string;
  workflowTag: any;
  status: number;

  response = [];

  updateForm = new FormGroup({
    status: new FormControl('')
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmApplyDialogModel,
              public dialogRef: MatDialogRef<ApplyProcessComponent>,
              private dialog: MatDialog,
              private service: ConfigPetitionService) {
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
    this.getWorkflowDetail();
  }

  updateStatus(status) {
    this.service.updateStatus(status, this.id).subscribe(data => {
      this.dialogRef.close(true);
    }, err => {
      console.error(err);
      this.dialogRef.close(false);
    });
  }

  public onConfirm(): void {
    this.status = 1;
    this.updateStatus(this.status);
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  updateProcess(id, name) {
    this.dialog.closeAll();
    this.service.updateProcess(id, name);
  }

  getWorkflowDetail() {
    this.service.getWorkflowDetail(this.id).subscribe(data => {
      this.response.push(data);
      this.workflowName = this.response[0].name;
      this.workflowTag = data.tag.length;
    }, err => {
      console.error(err);
    });
  }

}
export class ConfirmApplyDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
