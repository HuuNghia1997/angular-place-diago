import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-accept-petition',
  templateUrl: './accept-petition.component.html',
  styleUrls: ['./accept-petition.component.scss'],
})
export class AcceptPetitionComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<AcceptPetitionComponent>) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }
}
export class ConfirmAcceptDialogModel {
  constructor(
    public title: string,
    public message: string,
    public id: string
  ) {}
}
