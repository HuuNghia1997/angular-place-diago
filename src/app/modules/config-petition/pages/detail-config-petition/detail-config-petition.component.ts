import { Component, OnInit } from '@angular/core';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProcessComponent } from '../../dialog/add-process/add-process.component';
import { UpdateProcessComponent } from '../../dialog/update-process/update-process.component';
import { DeleteProcessComponent } from '../../dialog/delete-process/delete-process.component';

@Component({
  selector: 'app-detail-config-petition',
  templateUrl: './detail-config-petition.component.html',
  styleUrls: ['./detail-config-petition.component.scss']
})
export class DetailConfigPetitionComponent implements OnInit {

  configPetitionId: string;
  configPetition: ConfigPetitionElement;
  status: number;

  constructor(private actRoute: ActivatedRoute,
              private dialog: MatDialog) {
    this.configPetitionId = this.actRoute.snapshot.params.id;
    this.getConfigPetition(this.configPetitionId);
    this.status = this.getState(this.configPetition.status);
    // this.commentDataSource.data = TREE_DATA;
  }

  ngOnInit(): void {
  }

  getConfigPetition(id): void {
    CONFIG_PETITION_DATA.forEach(element => {
      if (element.id === id) {
        // console.log(element);
        this.configPetition =  element;
      }
    });
  }

  getState(status: string): number {
    if (status === 'Chưa áp dụng') {
      return 0;
    } else if (status === 'Đã áp dụng') {
      return 1;
    } else {
      return 2;
    }
  }

  openDialogAddProcess() {
    const dialogRef = this.dialog.open(AddProcessComponent, {
      width: '80%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }

  openDialogUpdateProcess() {
    const dialogRef = this.dialog.open(UpdateProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }

  openDialogDeleteProcess() {
    const dialogRef = this.dialog.open(DeleteProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }
}
