import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PickDatetimeAdapter } from 'src/app/data/schema/pick-datetime-adapter';
import { PICK_FORMATS } from 'src/app/data/service/config.service';
import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';

@Component({
  selector: 'app-update-petition',
  templateUrl: './update-petition.component.html',
  styleUrls: ['./update-petition.component.scss'],
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
export class UpdatePetitionComponent implements OnInit {

  Petitions = {
    title: 'Phản ánh về trật tự đô thị',
    topicSelectedList: ['Giáo dục', 'Y tế'],
    time: '12/12/2019, 14:00:00',
    reporter: 'La Văn Tam',
    placeCreate: 'số 123, Ấp Bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang',
    placePetition: 'số 123, Ấp Bắc, Thành phố Mỹ Tho, tỉnh Tiền Giang',
    content: 'Vào 7h20 phút ngày 12/12 trước cổng trường tiểu học Lê Lợi tình trạng đổ xe gây mất an toàn giao thông tắc ' +
      'đường mong quý cơ quan vào cuộc xử lý.',
    followerSelectedList: ['Lê Thị C', 'Nguyễn Văn D'],
    approverSelected: 'Nguyễn Văn B',
    publicized: 'true'
  };
  topicList: string[] = ['Giao thông', 'Y tế', 'Giáo dục', 'Môi trường', 'Cơ sở hạ tầng'];
  List: string[] = ['Nguyễn Văn A', 'Nguyễn Văn B', 'Lê Thị C', 'Nguyễn Văn D', 'La Văn Tam'];
  topics = new FormControl();
  followers = new FormControl();
  approver = new FormControl();
  group = new FormGroup({
    start: new FormControl()
  });
  date = new FormControl(new Date());
  checked = this.Petitions.publicized;

  @ViewChild('picker') picker: any;
  @ViewChild('pickerOccurred') pickerOccurred: any;
  @ViewChild('pickerCreate') pickCreate: any;

  public dates: Date;
  public showSpinners = true;
  public showSeconds = true;
  public touchUi = true;
  public enableMeridian = false;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;

  public dateApprove = new FormControl(new Date(2019, 11, 19, 15, 30, 0));
  public dateOccurred = new FormControl(new Date(2019, 12, 12, 14, 0, 0));
  public dateCreate = new FormControl(new Date(2019, 12, 12, 15, 0, 0));


  constructor() {
    this.topics.setValue(this.Petitions.topicSelectedList);
    this.followers.setValue(this.Petitions.followerSelectedList);
    this.approver.setValue(this.Petitions.approverSelected);
  }

  ngOnInit(): void {
    this.dates = new Date(2019, 11, 19, 13, 30, 0);
  }

}
