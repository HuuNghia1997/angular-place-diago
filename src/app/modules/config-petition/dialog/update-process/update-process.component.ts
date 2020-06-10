import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-process',
  templateUrl: './update-process.component.html',
  styleUrls: ['./update-process.component.scss']
})
export class UpdateProcessComponent implements OnInit {

  public reg = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  updateForm = new FormGroup({
    title: new FormControl(''),
    topics: new FormControl(''),
    agency: new FormControl(''),
    process: new FormControl('')
  });
  title = new FormControl('', [Validators.required, Validators.pattern(this.reg)]);

  topics = new FormControl();
  topicList: string[] = ['Giao thông', 'Y tế', 'Giáo dục', 'Môi trường', 'Cơ sở hạ tầng'];

  agency = new FormControl();
  agencyList: string[] = ['UBND tỉnh Tiền Giang', 'UBND tỉnh Đồng Tháp', 'UBND tỉnh Bến Tre'];

  process = new FormControl();
  processList: string[] = ['quy-trinh-mau', 'quy-trinh-mau2', 'quy-trinh-mau3'];

  constructor(private service: ConfigPetitionService,
              public dialogRef: MatDialogRef<UpdateProcessComponent>) { }

  ngOnInit(): void {
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  drawProcess() {
    this.service.drawProcess();
  }
}

export class ConfirmUpdateDialogModel {
  constructor(public title: string,
              public id: string) { }
}
