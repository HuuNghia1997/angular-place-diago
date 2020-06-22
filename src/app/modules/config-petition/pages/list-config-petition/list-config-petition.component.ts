import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { PICK_FORMATS, pageSizeOptions } from 'src/app/data/service/config.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigPetitionElement } from 'src/app/data/schema/config-petition-element';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ShowProcessComponent } from '../../dialog/show-process/show-process.component';
import { ConfigPetitionService } from 'src/app/data/service/config-petition.service';
import { PaginatorService } from 'src/app/data/service/paginator.service';

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
export class ListConfigPetitionComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['STT', 'name', 'topic', 'date', 'status', 'action'];
  ELEMENT_DATA: ConfigPetitionElement[] = [];
  dataSource: MatTableDataSource<ConfigPetitionElement>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  categoryId = '3';
  pageSizes = pageSizeOptions;
  totalElements: number;
  totalPages: number;
  selectedPageSize: number;
  currentPage: number;

  searchForm = new FormGroup({
    name: new FormControl(''),
    tag: new FormControl(''),
    status: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl('')
  });
  listTags = [];

  constructor(private dialog: MatDialog,
              private service: ConfigPetitionService,
              private translator: PaginatorService,
              public datepipe: DatePipe,
              private cdRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.search(0, pageSizeOptions[1]);
    this.getListTags();
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

  public getListTags() {
    this.service.getListTags(this.categoryId).subscribe(data => {
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.listTags.push(data.content[i]);
      }
    }, err => {
      console.error(err);
    });
  }

  getStatus(status: number) {
    switch (status) {
      case 0:
        return 'Chưa áp dụng';
      case 1:
        return 'Đã áp dụng';
      case 2:
        return 'Đã hủy áp dụng';
    }
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

  openDialogShowProcess() {
    const dialogRef = this.dialog.open(ShowProcessComponent, {
      width: '80%'
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

    this.service.search(searchString).subscribe(data => {
      this.ELEMENT_DATA = [];
      const size = data.numberOfElements;
      for (let i = 0; i < size; i++) {
        this.ELEMENT_DATA.push(data.content[i]);
      }
      this.dataSource.data = this.ELEMENT_DATA;
      this.dataSource.paginator.pageSize = pageSize;
      this.totalElements = data.totalElements;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
      this.selectedPageSize = pageSize;

      this.resetPageSize();
    }, err => {
      console.error(err);
    });
    searchString = '';
  }
}
