import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';

@Component({
  selector: 'app-delete-process',
  templateUrl: './delete-process.component.html',
  styleUrls: ['./delete-process.component.scss']
})
export class DeleteProcessComponent implements OnInit {

  message: string;
  id: string;
  workflowStatus: number;

  response = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogModel,
              public dialogRef: MatDialogRef<DeleteProcessComponent>,
              private service: ConfigPetitionService) {
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
    this.getWorkflowDetail();
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  getWorkflowDetail() {
    this.service.getWorkflowDetail(this.id).subscribe(data => {
      this.response.push(data);
      this.workflowStatus = this.response[0].status;
    }, err => {
      console.error(err);
    });
  }

  onConfirm(id): void {
    this.service.deleteWorkflow(id).subscribe(data => {
      this.dialogRef.close(true);
    }, err => {
      console.error(err);
      this.dialogRef.close(false);
    });
  }
}

export class ConfirmDeleteDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
