import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CONFIG_PETITION_DATA, ConfigPetitionElement } from 'src/app/data/schema/config-petition-element';

@Component({
  selector: 'app-delete-process',
  templateUrl: './delete-process.component.html',
  styleUrls: ['./delete-process.component.scss']
})
export class DeleteProcessComponent implements OnInit {

  title: string;
  message: string;
  id: string;
  configPetition: ConfigPetitionElement;

  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogModel,
              public dialogRef: MatDialogRef<DeleteProcessComponent>) {
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

export class ConfirmDeleteDialogModel {
  constructor(public title: string, public message: string, public id: string) {
  }
}
