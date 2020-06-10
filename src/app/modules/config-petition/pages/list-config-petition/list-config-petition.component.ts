import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { PICK_FORMATS, pageSizeOptions } from 'src/app/data/service/config.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigPetitionElement, CONFIG_PETITION_DATA } from 'src/app/data/schema/config-petition-element';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddProcessComponent } from '../../dialog/add-process/add-process.component';
import { UpdateProcessComponent } from '../../dialog/update-process/update-process.component';
import { ShowProcessComponent } from '../../dialog/show-process/show-process.component';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';

@Component({
  selector: 'app-list-config-petition',
  templateUrl: './list-config-petition.component.html',
  styleUrls: ['./list-config-petition.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ListConfigPetitionComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['STT', 'title', 'topic', 'date', 'status', 'agency', 'action'];
  dataSource = new MatTableDataSource<ConfigPetitionElement>(CONFIG_PETITION_DATA);

  agency = new FormControl();
  agencyList: string[] = ['UBND huyện Cái Bè', 'UBND huyện Cai Lậy', 'UBND Thành phố Mỹ Tho'];

  topics = new FormControl();
  topicList: string[] = ['Giáo dục', 'Y tế', 'Cơ sở hạ tầng', 'Môi trường', 'Trật tự đô thị'];
  pageSizes = pageSizeOptions;

  constructor(private dialog: MatDialog,
              private service: ConfigPetitionService) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addProcess() {
    this.service.addProcess();
  }

  updateProcess(id, name): void {
    this.service.updateProcess(id, name);
  }

  deleteProcess(id, name): void {
    this.service.deleteProcess(id, name);
  }

  unApplyProcess(id, name): void {
    this.service.unApplyProcess(id, name);
  }

  applyProcess(id, name): void {
    this.service.applyProcess(id, name);
  }

  openDialogUpdateProcess() {
    const dialogRef = this.dialog.open(UpdateProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }

  openDialogShowProcess() {
    const dialogRef = this.dialog.open(ShowProcessComponent, {
      width: '80%'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }
}
