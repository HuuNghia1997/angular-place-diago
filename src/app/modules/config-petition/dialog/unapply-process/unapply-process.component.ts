import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';

@Component({
  selector: 'app-unapply-process',
  templateUrl: './unapply-process.component.html',
  styleUrls: ['./unapply-process.component.scss']
})
export class UnapplyProcessComponent implements OnInit {

  isLinear = true;
  message: string;
  id: string;
  workflowName: string;
  workflowCustomer: string;
  status: number;

  response = [];

  updateForm = new FormGroup({
    status: new FormControl('')
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmUnapplyDialogModel,
              public dialogRef: MatDialogRef<UnapplyProcessComponent>,
              private service: ConfigPetitionService) {
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
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
    this.status = 2;
    this.updateStatus(this.status);
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

}
export class ConfirmUnapplyDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
