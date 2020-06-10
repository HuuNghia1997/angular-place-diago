import { Component, OnInit } from '@angular/core';
import { ApplyProcessComponent } from '../apply-process/apply-process.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-process',
  templateUrl: './show-process.component.html',
  styleUrls: ['./show-process.component.scss']
})
export class ShowProcessComponent implements OnInit {

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<ShowProcessComponent>) { }

  ngOnInit(): void {
  }

  onDismiss(): void {
    // Close dialog, return false
    this.dialogRef.close();
  }

  openDialogApplyProcess() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(ApplyProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }
}
