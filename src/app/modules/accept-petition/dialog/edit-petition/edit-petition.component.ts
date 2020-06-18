import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import {
  NgxMatDateAdapter,
  NGX_MAT_DATE_FORMATS,
} from '@angular-material-components/datetime-picker';
import { FileUploader } from 'ng2-file-upload';
import { MapComponent } from 'src/app/modules/accept-petition/dialog/map/map.component';
import { MapboxService } from 'src/app/data/service/mapbox.service';

function readBase64(file): Promise<any> {
  const reader = new FileReader();
  const future = new Promise((resolve, reject) => {
    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'load',
      function () {
        resolve(reader.result);
      },
      false
    );

    // tslint:disable-next-line:only-arrow-functions
    reader.addEventListener(
      'error',
      function (event) {
        reject(event);
      },
      false
    );

    reader.readAsDataURL(file);
  });
  return future;
}

@Component({
  selector: 'app-edit-petition',
  templateUrl: './edit-petition.component.html',
  styleUrls: ['./edit-petition.component.scss'],
  providers: [
    { provide: NgxMatDateAdapter, useClass: PickDatetimeAdapter },
    {
      provide: NGX_MAT_DATE_FORMATS,
      useValue: PICK_FORMATS,
    },
  ],
})
export class EditPetitionComponent implements OnInit {
  acceptPetition = {
    person: {
      name: 'La Văn Tam',
      phone: '0941234567',
      identifyId: '331223344',
      address: 'Số 122, Ấp Bắc, Thành phố Mỹ Tho, Tỉnh Tiền Giang',
      objectType: 'Cá nhân',
      village: 'Phường 10',
      town: 'Thành phố Mỹ Tho',
      province: 'Tiền Giang',
    },
    petition: {
      title: 'Phản ánh về trật tự đô thị',
      topic: ['Giáo dục', 'Y tế'],
      time: '12/12/2019, 14:00:00',
      agency: ['UBND tỉnh Tiền Giang', 'UBND tỉnh Đồng Tháp'],
      content:
        'Vào 6h20 phút ngày 12/12 trước cổng trường tiểu học Lê Lợi tình trạng đổ xe gây mất an toàn giao thông tắc đường mong quý cơ quan vào cuộc xử lý.',
      placePetition: 'số 123, Ấp Bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang',
      option: ['Công khai phản ánh'],
    },
  };

  updateForm = new FormGroup({
    personName: new FormControl(this.acceptPetition.person.name),
    phone: new FormControl(this.acceptPetition.person.phone),
    title: new FormControl(this.acceptPetition.petition.title),
    tag: new FormControl(''),
    occurredDate: new FormControl(''),
    content: new FormControl(this.acceptPetition.petition.content),
    placePetition: new FormControl(this.acceptPetition.petition.placePetition),
  });
  personName = new FormControl('', [Validators.required]);
  phone = new FormControl('', [Validators.required]);
  title = new FormControl('', [Validators.required]);
  tag = new FormControl('', [Validators.required]);
  occurredDate = new FormControl('', [Validators.required]);
  content = new FormControl('', [Validators.required]);
  placePetition = new FormControl('', [Validators.required]);
  titleDialog: string = 'phản ánh';

  topicList: string[] = [
    'Giao thông',
    'Y tế',
    'Giáo dục',
    'Môi trường',
    'Cơ sở hạ tầng',
  ];
  agencyList: string[] = [
    'UBND tỉnh Tiền Giang',
    'UBND tỉnh Đồng Tháp',
    'UBND tỉnh Bến Tre',
  ];
  objectTypeList: string[] = ['Cá nhân', 'Tổ chức'];
  villageList: string[] = ['Phường 10', 'xã Tân Mỹ Chánh'];
  townList: string[] = ['Thành phố Mỹ Tho', 'Châu Thành'];
  provinceList: string[] = ['Tiền Giang', ' Vĩnh Long'];
  optionList: string[] = ['Gửi tin nhắn SMS', 'Công khai phản ánh'];

  @ViewChild('pickerOccurred') pickerOccurred: any;

  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  objectType = new FormControl(this.acceptPetition.person.objectType);
  village = new FormControl('Phường 10');
  town = new FormControl('Thành phố Mỹ Tho');
  province = new FormControl('Tiền Giang');
  dateApprove = new FormControl(new Date(2019, 11, 19, 15, 30, 0));
  topic = new FormControl(this.acceptPetition.petition.topic);
  agency = new FormControl(this.acceptPetition.petition.agency);
  options = new FormControl(this.acceptPetition.petition.option);

  public uploader: FileUploader = new FileUploader({
    disableMultipart: true,
    autoUpload: true,
    method: 'post',
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf', 'doc', 'xls', 'ppt'],
  });
  public hasBaseDropZoneOver = false;

  constructor(
    private service: AcceptPetitionService,
    public dialogRef: MatDialogRef<EditPetitionComponent>,
    private dialog: MatDialog,
    private map: MapboxService
  ) {}

  ngOnInit(): void {}

  onDismiss(): void {
    // Đóng dialog, trả kết quả là false
    this.dialogRef.close();
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileSelected(event: any) {
    const file: File = event[0];
    // console.log(file);
    // tslint:disable-next-line:only-arrow-functions
    readBase64(file).then(function (data) {
      // console.log(data);
    });
  }

  openDialogMap() {
    const dialogRef = this.dialog.open(MapComponent, {
      width: '80%',
      height: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('This dialog was closed');
    });
  }
}
export class ConfirmUpdateDialogModel {
  constructor(public title: string, public id: string) {}
}
