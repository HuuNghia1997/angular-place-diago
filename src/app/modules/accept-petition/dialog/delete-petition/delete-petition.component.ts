import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-petition',
  templateUrl: './delete-petition.component.html',
  styleUrls: ['./delete-petition.component.scss'],
})
export class DeletePetitionComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeletePetitionComponent>) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }
}
export class ConfirmDeleteDialogModel {
  constructor(
    public title: string,
    public message: string,
    public id: string
  ) {}
}
