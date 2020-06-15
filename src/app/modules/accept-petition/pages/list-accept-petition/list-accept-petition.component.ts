import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {
  PetitionElement,
  PETITION_DATA,
} from 'src/app/data/schema/petition-element';
import {
  PICK_FORMATS,
  pageSizeOptions,
} from 'src/app/data/service/config.service';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-accept-petition',
  templateUrl: './list-accept-petition.component.html',
  styleUrls: ['./list-accept-petition.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe,
  ],
})
export class ListAcceptPetitionComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = [
    'STT',
    'title',
    'topic',
    'date',
    'place',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<PetitionElement>(PETITION_DATA);
  topics = new FormControl();
  topicList: string[] = [
    'Giáo dục',
    'Y tế',
    'Cơ sở hạ tầng',
    'Môi trường',
    'Trật tự đô thị',
  ];
  pageSizes = pageSizeOptions;

  constructor(private service: AcceptPetitionService) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addRecord() {
    this.service.addRecord();
  }

  deleteRecord(id, name): void {
    this.service.deleteRecord(id, name);
  }

  updateRecord(id, name): void {
    this.service.updateRecord(id, name);
  }

  acceptPetition(id, name): void {
    this.service.acceptPetition(id, name);
  }
}
