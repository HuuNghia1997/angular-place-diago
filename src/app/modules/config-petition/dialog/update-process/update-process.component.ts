import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { MatDialog } from '@angular/material/dialog';
import { DrawProcessComponent } from '../draw-process/draw-process.component';

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
              private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getErrorMessage(id) {
    return this.service.formErrorMessage(id);
  }

  openDialogDrawProcess() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(DrawProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }
}
