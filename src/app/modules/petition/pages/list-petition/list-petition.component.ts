import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PetitionElement } from 'src/app/data/schema/petition-element';
import { PICK_FORMATS, pageSizeOptions, reloadTimeout } from 'src/app/data/service/config.service';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PetitionService } from 'src/app/data/service/petition.service';
import { PaginatorService } from 'src/app/data/service/paginator.service';
import { KeycloakService } from 'keycloak-angular';
import { SnackbarService } from 'src/app/data/service/snackbar.service';
import { Router } from '@angular/router';

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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['STT', 'title', 'topic', 'date', 'place', 'status', 'action'];
  ELEMENT_DATA: any[] = [];
  dataSource: MatTableDataSource<PetitionElement>;

  pageSizes = pageSizeOptions;
  totalElements: number;
  totalPages: number;
  selectedPageSize: number;
  currentPage = 0;
  categoryId = '3';
  listTags = [];
  lengthPetition: number;

  searchForm = new FormGroup({
    title: new FormControl(''),
    place: new FormControl(''),
    receptionMethod: new FormControl(''),
    tag: new FormControl(''),
    startDate: new FormControl(null),
    endDate: new FormControl(null)
  });

  constructor(private dialog: MatDialog,
              private service: PetitionService,
              private translator: PaginatorService,
              public datepipe: DatePipe,
              private cdRef: ChangeDetectorRef,
              private keycloak: KeycloakService,
              private snackbar: SnackbarService,
              private router: Router) {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.selectedPageSize = pageSizeOptions[1];
    this.search(0);
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

  searchFormreset() {
    this.searchForm = new FormGroup({
      title: new FormControl(''),
      place: new FormControl(''),
      receptionMethod: new FormControl(''),
      tag: new FormControl(''),
      startDate: new FormControl(null),
      endDate: new FormControl(null)
    });
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

  claimTask(taskId, name) {
    const message = 'Nhận xử lý';
    const content = name;
    const reason = '';
    this.service.claimTask(taskId).subscribe(res => {
      this.snackbar.openSnackBar(message, content, 'thành công', reason, 'success_notification');
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(function() {
        window.location.reload();
      }, reloadTimeout);
    }, err => {
      this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
      if (err.status === 401) {
        this.keycloak.login();
      }
    });
  }

  releaseTask(taskId, name) {
    const message = 'Bỏ nhận xử lý';
    const content = name;
    const reason = '';
    this.service.releaseTask(taskId).subscribe(res => {
      this.snackbar.openSnackBar(message, content, 'thành công', reason, 'success_notification');
      // tslint:disable-next-line: only-arrow-functions
      setTimeout(function() {
        window.location.reload();
      }, reloadTimeout);
    }, err => {
      if (err.status === 401) {
        this.snackbar.openSnackBar(message, content, 'thất bại', reason, 'error_notification');
        this.keycloak.login();
      }
    });
  }

  completePetition(id, name) {
    this.service.completePetition(id, name);
  }

  onPaginateChange($event) {
    this.selectedPageSize = $event.pageSize;
    this.paginatorChange(0, $event.pageSize, 5);
  }

  public paginatorChange(page, pageSize, type) {
    switch (type) {
      case 1:
        this.search(page);
        this.currentPage++;
        this.resetPageSize();
        break;
      case 2:
        this.search(page);
        this.currentPage--;
        this.resetPageSize();
        break;
      case 3:
        this.search(page);
        this.currentPage = this.totalPages;
        this.resetPageSize();
        break;
      case 4:
        this.search(page);
        this.currentPage = 0;
        this.resetPageSize();
        break;
      case 5:
        this.search(page);
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

  search(page) {
    const formObj = this.searchForm.getRawValue();
    if (formObj.title === '' && formObj.place === '' && formObj.receptionMethod === '' &&
      formObj.tag === '' && formObj.startDate === null && formObj.endDate === null) {
      this.service.getPetitionList(page, this.selectedPageSize, true).subscribe(data => {
        this.fetchData(data, page, this.selectedPageSize);
      }, err => {
        if (err.status === 401) {
          this.keycloak.login();
        }
      });
    } else {
      const title = formObj.title;
      const place = formObj.place;
      const receptionMethod = formObj.receptionMethod;
      const category = formObj.tag;
      const fromDate = formObj.startDate;
      const toDate = formObj.endDate;
      this.service.search(page, true, this.selectedPageSize, title, place, category, receptionMethod, fromDate, toDate).subscribe(res => {
        this.fetchData(res, page, this.selectedPageSize);
      });
    }
  }

  fetchData(data, page, pageSize) {
    this.ELEMENT_DATA = [];
    const size = data.list.entries.length;
    for (let i = 0; i < size; i++) {
      this.ELEMENT_DATA.push(data.list.entries[i].entry);
      data.list.entries[i].entry.stt = pageSize * this.currentPage + (i + 1);
    }
    this.lengthPetition = this.ELEMENT_DATA.length;
    this.dataSource.data = this.ELEMENT_DATA;
    this.dataSource.paginator.pageSize = pageSize;
    this.totalElements = data.list.pagination.totalItems;
    const totalPage = data.list.pagination.totalItems / pageSize;
    this.totalPages = Math.ceil(totalPage);
    this.selectedPageSize = pageSize;
    this.resetPageSize();
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
