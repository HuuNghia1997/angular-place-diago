import { Component, OnInit, Inject } from '@angular/core';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UpdateProcessComponent } from '../update-process/update-process.component';

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
              private dialog: MatDialog) {
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

  openDialogUpdateProcess() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(UpdateProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
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
