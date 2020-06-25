import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PetitionElement, PETITION_DATA} from 'src/app/data/schema/petition-element';
import { PICK_FORMATS, pageSizeOptions, reloadTimeout } from 'src/app/data/service/config.service';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationCompletedComponent } from '../../dialog/confirmation-completed/confirmation-completed.component';
import { PetitionService } from 'src/app/data/service/petition.service';
import { PaginatorService } from 'src/app/data/service/paginator.service';
import { KeycloakService } from 'keycloak-angular';

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
export class ListPetitionComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['STT', 'title', 'topic', 'date', 'place', 'status', 'action'];
  ELEMENT_DATA: any[] = [];
  dataSource: MatTableDataSource<PetitionElement>;

  pageSizes = pageSizeOptions;
  totalElements: number;
  totalPages: number;
  selectedPageSize: number;
  currentPage: number;
  categoryId = '3';
  listTags = [];
  lengthPetition: number;

  searchForm = new FormGroup({
    title: new FormControl(''),
    place: new FormControl(''),
    receptionMethod: new FormControl(''),
    tag: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });

  constructor(private dialog: MatDialog,
              private service: PetitionService,
              private translator: PaginatorService,
              public datepipe: DatePipe,
              private cdRef: ChangeDetectorRef,
              private keycloak: KeycloakService) {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.search(0, pageSizeOptions[1]);
    this.dataSource.sort = this.sort;
    this.getListTag();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = pageSizeOptions[1];
    this.translator.translatePaginator(this.paginator);
    this.paginator.nextPage = () => this.paginatorChange(this.currentPage + 1, this.paginator.pageSize, 1);
    this.paginator.previousPage = () => this.paginatorChange(this.currentPage - 1, this.paginator.pageSize, 2);
    this.paginator.lastPage = () => this.paginatorChange(this.totalPages - 1, this.paginator.pageSize, 3);
    this.paginator.firstPage = () => this.paginatorChange(0, this.paginator.pageSize, 4);
    this.cdRef.detectChanges();
  }

  getListTag() {
    this.service.getListTag(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  claimTask(id) {
    this.service.getDetailPetition(id).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      this.service.claimTask(taskId).subscribe(res => {
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    });
  }

  releaseTask(id) {
    this.service.getDetailPetition(id).subscribe(data => {
      const taskId = data.list.entries[0].entry.id;
      this.service.releaseTask(taskId).subscribe(res => {
        // tslint:disable-next-line: only-arrow-functions
        setTimeout(function() {
          window.location.reload();
        }, reloadTimeout);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    });
  }

  openDialogConfirmationCompleted() {
    const dialogRef = this.dialog.open(ConfirmationCompletedComponent, {
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('This dialog was closed');
    });
  }

  onPaginateChange($event) {
    this.paginatorChange(0, $event.pageSize, 5);
  }

  public paginatorChange(page, pageSize, type) {
    switch (type) {
      case 1:
        this.search(page, pageSize);
        this.currentPage++;
        this.resetPageSize();
        break;
      case 2:
        this.search(page, pageSize);
        this.currentPage--;
        this.resetPageSize();
        break;
      case 3:
        this.search(page, pageSize);
        this.currentPage = this.totalPages;
        this.resetPageSize();
        break;
      case 4:
        this.search(page, pageSize);
        this.currentPage = 0;
        this.resetPageSize();
        break;
      case 5:
        this.search(page, pageSize);
        this.currentPage = 0;
        this.resetPageSize();
        break;
    }
  }

  public resetPageSize() {
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.dataSource.paginator.length = this.totalElements;
    }, 500);
  }

  search(page, pageSize) {
    const formObj = this.searchForm.getRawValue();
    let searchString = 'page=' + page;
    searchString = searchString + '&size=' + pageSize;

    formObj.startDate = this.datepipe.transform(formObj.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    formObj.endDate = this.datepipe.transform(formObj.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

    if (formObj.name != null ) {
      searchString = searchString + '&name=' + formObj.name;
    }

    if (formObj.tag != null ) {
      for (const i of formObj.tag) {
        searchString = searchString + '&tag-id=' + i;
      }
    }

    if (formObj.status != null) {
      searchString = searchString + '&status=' + formObj.status;
    }

    if (formObj.startDate != null) {
      formObj.startDate = formObj.startDate.replace('+', '%2B');
    }

    if (formObj.endDate != null) {
      formObj.endDate = formObj.endDate.replace('+', '%2B');
    }

    if (formObj.startDate != null) {
      searchString = searchString + '&start-date=' + formObj.startDate;
    }

    if (formObj.startDate != null) {
      searchString = searchString + '&end-date=' + formObj.endDate;
    }

    this.service.getPetitionList().subscribe(data => {
      this.ELEMENT_DATA = [];
      const size = data.list.entries.length;
      for (let i = 0; i < size; i++) {
        this.ELEMENT_DATA.push(data.list.entries[i].entry);
        console.log(data.list.entries[i].entry);
      }
      this.lengthPetition = this.ELEMENT_DATA.length;
      console.log(this.ELEMENT_DATA);
      this.dataSource.data = this.ELEMENT_DATA;
      this.dataSource.paginator.pageSize = pageSize;
      this.totalElements = data.totalElements;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
      this.selectedPageSize = pageSize;

      this.resetPageSize();
    }, err => {
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
    searchString = '';
  }

  getStatus(status: string) {
    switch (status) {
      case 'ASSIGNED':
        return 'Chờ xử lý';
      case 'CREATED':
        return 'Chờ nhận xử lý';
    }
  }
}
