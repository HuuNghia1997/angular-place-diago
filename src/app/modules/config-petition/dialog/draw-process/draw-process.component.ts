import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-draw-process',
  templateUrl: './draw-process.component.html',
  styleUrls: ['./draw-process.component.scss']
})
export class DrawProcessComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DrawProcessComponent>) { }

  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

}
export class ConfirmDrawDialogModel {
  constructor(public title: string) {}
}
