import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from 'src/app/data/service/notification.service';
import { PaginatorService } from 'src/app/data/service/paginator.service';
import { PICK_FORMATS, pageSizeOptions, notificationCategoryId } from 'src/app/data/service/config.service';
import { PeriodicElement } from 'src/app/data/schema/periodic-element';
import { AgencyInfo } from 'src/app/data/schema/agency-info';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';

@Component({
  selector: 'app-list-notification',
  templateUrl: './list-notification.component.html',
  styleUrls: ['./list-notification.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: PickDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
    DatePipe
  ]
})
export class ListNotificationComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['stt', 'title', 'agency', 'catalogy', 'receiver', 'created_at', 'status', 'endDate', 'options'];
  ELEMENTDATA: PeriodicElement[] = [];
  dataSource: MatTableDataSource<PeriodicElement>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  categoryId = notificationCategoryId;
  pageSizes = pageSizeOptions;
  totalElements: number;
  totalPages: number;
  selectedPageSize: number;
  currentPage: number;

  searchForm = new FormGroup({
    title: new FormControl(''),
    tag: new FormControl(''),
    agency: new FormControl(''),
    publish: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    receiver: new FormControl('')
  });

  listTags = [];

  result: boolean;
  agencyList: AgencyInfo[] = [];

  constructor(private service: NotificationService,
              private translator: PaginatorService,
              public datepipe: DatePipe,
              private cdRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource(this.ELEMENTDATA);
    service.registerMyApp(this);
  }

  ngOnInit(): void {
    this.search(0, pageSizeOptions[1]);
    this.getListTags();
    this.getAgency();
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

  public getListTags() {
    this.service.getListTags(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      console.log(err);
    });
  }

  getAgency() {
    this.service.getAgency().subscribe(data => {
      this.agencyList = data.content;
    });
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

  sendNotification(id, name): void {
    this.service.sendNotification(id, name);
  }

  search(page, pageSize) {
    const formObj = this.searchForm.getRawValue();
    let searchString = 'page=' + page;
    searchString = searchString + '&size=' + pageSize;

    formObj.startDate = this.datepipe.transform(formObj.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
    formObj.endDate = this.datepipe.transform(formObj.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');

    if (formObj.title != null ) {
        searchString = searchString + '&title=' + formObj.title;
    }
    if (formObj.tag != null ) {
        for (const i of formObj.tag) {
            searchString = searchString + '&tag-id=' + i;
        }
    }
    if (formObj.agency != null) {
        searchString = searchString + '&agency-id=' + formObj.agency;
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
    if (formObj.publish != null) {
        searchString = searchString + '&publish=' + formObj.publish;
    }

    this.service.search(searchString).subscribe(data => {
        this.ELEMENTDATA = [];
        const size = data.numberOfElements;
        for (let i = 0; i < size; i++) {
            this.ELEMENTDATA.push(data.content[i]);
        }
        this.dataSource.data = this.ELEMENTDATA;
        this.dataSource.paginator.pageSize = pageSize;
        this.totalElements = data.totalElements;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
        this.selectedPageSize = pageSize;

        this.resetPageSize();
    }, err => {
      console.log(err);
    });
    searchString = '';
  }

}
