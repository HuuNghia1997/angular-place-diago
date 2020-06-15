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
  title: string = 'Tiếp nhận phản ánh';
  petitionTitle: string = 'Phản ánh về trật tự đô thị';
  optionList: string[] = ['Gửi tin nhắn SMS', 'Công khai phản ánh'];
  processList: string[] = [
    'Quy trình phản ánh chung',
    'Quy trình phản ánh về môi trường',
    'Quy trình phản ánh về môi trường 2',
  ];

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
