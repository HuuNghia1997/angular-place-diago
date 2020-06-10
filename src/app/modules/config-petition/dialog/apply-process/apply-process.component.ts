import { Component, OnInit, Inject } from '@angular/core';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';

@Component({
  selector: 'app-apply-process',
  templateUrl: './apply-process.component.html',
  styleUrls: ['./apply-process.component.scss']
})
export class ApplyProcessComponent implements OnInit {

  isLinear = true;
  title: string;
  message: string;
  id: string;
  configPetition: ConfigPetitionElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmApplyDialogModel,
              public dialogRef: MatDialogRef<ApplyProcessComponent>,
              private dialog: MatDialog,
              private service: ConfigPetitionService) {
    this.title = data.title;
    this.message = data.message;
    this.id = data.id;
    this.getConfigPetition(this.id);
  }

  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  updateProcess(id, name) {
    this.dialog.closeAll();
    this.service.updateProcess(id, name);
  }

  getConfigPetition(id): void {
    CONFIG_PETITION_DATA.forEach(element => {
      if (element.id === id) {
        // console.log(element);
        this.configPetition =  element;
      }
    });
  }

}
export class ConfirmApplyDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
