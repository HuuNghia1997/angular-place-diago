import { Component, OnInit, ViewChild } from '@angular/core';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatDialogRef } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-add-petition',
  templateUrl: './add-petition.component.html',
  styleUrls: ['./add-petition.component.scss'],
  providers: [
    { provide: NgxMatDateAdapter,
      useClass: PickDatetimeAdapter
    },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: PICK_FORMATS
    }
  ]
})
export class AddPetitionComponent implements OnInit {
  topicList: string[] = ['Giao thông', 'Y tế', 'Giáo dục', 'Môi trường', 'Cơ sở hạ tầng'];
  agencyList: string[] = ['UBND tỉnh Tiền Giang', 'UBND tỉnh Đồng Tháp', 'UBND tỉnh Bến Tre'];
  reporterList: string[] = ['Cá nhân', 'Tổ chức'];

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  constructor(
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<AddPetitionComponent>
  ) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }
}

export class ConfirmAddDialogModel {
  constructor(public title: string) {}
}
