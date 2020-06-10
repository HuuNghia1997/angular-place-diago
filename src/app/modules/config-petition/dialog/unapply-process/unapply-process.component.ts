import { Component, OnInit, Inject } from '@angular/core';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-unapply-process',
  templateUrl: './unapply-process.component.html',
  styleUrls: ['./unapply-process.component.scss']
})
export class UnapplyProcessComponent implements OnInit {

  title: string;
  message: string;
  id: string;
  configPetition: ConfigPetitionElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmUnapplyDialogModel,
              public dialogRef: MatDialogRef<UnapplyProcessComponent>) {
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

  getConfigPetition(id): void {
    CONFIG_PETITION_DATA.forEach(element => {
      if (element.id === id) {
        // console.log(element);
        this.configPetition =  element;
      }
    });
  }

}
export class ConfirmUnapplyDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
