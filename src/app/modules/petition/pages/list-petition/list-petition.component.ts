import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PetitionElement, PETITION_DATA} from 'src/app/data/schema/petition-element';
import { PICK_FORMATS, pageSizeOptions } from 'src/app/data/service/config.service';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationCompletedComponent } from '../../dialog/confirmation-completed/confirmation-completed.component';

@Component({
  selector: 'app-list-petition',
  templateUrl: './list-petition.component.html',
  styleUrls: ['./list-petition.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ListPetitionComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['STT', 'title', 'topic', 'date', 'place', 'status', 'action'];
  dataSource = new MatTableDataSource<PetitionElement>(PETITION_DATA);

  topics = new FormControl();
  topicList: string[] = ['Giáo dục', 'Y tế', 'Cơ sở hạ tầng', 'Môi trường', 'Trật tự đô thị'];
  pageSizes = pageSizeOptions;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openDialogConfirmationCompleted() {
    const dialogRef = this.dialog.open(ConfirmationCompletedComponent, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }

}
