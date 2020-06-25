import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AcceptPetitionElement } from 'src/app/data/schema/accept-petition-element';
import {
  PICK_FORMATS,
  pageSizeOptions,
} from 'src/app/data/service/config.service';
import { PickDateAdapter } from 'src/app/data/schema/pick-date-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { AcceptPetitionService } from 'src/app/data/service/accept-petition.service';
import { PaginatorService } from 'src/app/data/service/paginator.service';
import { MatDialog } from '@angular/material/dialog';
import { petitionCategoryId } from 'src/app/data/service/config.service';

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

  categoryId = petitionCategoryId;

  pageSizes = pageSizeOptions;

  // Initialization for searching and paginating
  totalElements: number;
  totalPages: number;
  selectedPageSize: number;
  currentPage: number;

  // Initialization list of tag
  tagList = [];
  receptionMethodList: string[] = ['Công khai', 'không công khai'];

  // Setting table data
  displayedColumns: string[] = [
    'no',
    'title',
    'tag',
    'createDate',
    'takePlaceAt',
    'status',
    'action',
  ];
  ELEMENTDATA: AcceptPetitionElement[] = [];
  dataSource: MatTableDataSource<AcceptPetitionElement>;

  searchForm = new FormGroup({
    title: new FormControl(''),
    takePlaceAtFullAddress: new FormControl(''),
    tag: new FormControl(''),
    receptionMethod: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  constructor(
    private service: AcceptPetitionService,
    private translator: PaginatorService,
    public datepipe: DatePipe
  ) {
    this.dataSource = new MatTableDataSource(this.ELEMENTDATA);
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getListTag();
    this.search(0, pageSizeOptions[1]);
  }

  // Lấy danh sách chuyên mục từ service
  public getListTag() {
    this.service.getListTag(this.categoryId).subscribe(
      (data) => {
        const size = data.numberOfElements;
        for (let i = 0; i < size; i++) {
          this.tagList.push(data.content[i]);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  // Tìm kiếm danh sách phản ánh từ service
  search(page, pageSize) {
    const formObject = this.searchForm.getRawValue();
    let searchString = 'page=' + page;
    searchString = searchString + '&size=' + pageSize;

    formObject.startDate = this.datepipe.transform(
      formObject.startDate,
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    );

    formObject.endDate = this.datepipe.transform(
      formObject.endDate,
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    );

    if (formObject.title != null) {
      searchString = searchString + '&title=' + formObject.title;
    }

    if (formObject.takePlaceAtFullAddress != null) {
      searchString =
        searchString +
        '&take-place-at-full-address=' +
        formObject.takePlaceAtFullAddress;
    }

    if (formObject.tag != null) {
      for (const i of formObject.tag) {
        searchString = searchString + '&tag-id=' + i;
      }
    }

    if (formObject.receptionMethod != null) {
      searchString =
        searchString + '&reception-method=' + formObject.receptionMethod;
    }

    if (formObject.startDate != null) {
      formObject.startDate = formObject.startDate.replace('+', '%2B');
      searchString = searchString + '&start-date=' + formObject.startDate;
    }

    if (formObject.endDate != null) {
      formObject.endDate = formObject.endDate.replace('+', '%2B');
      searchString = searchString + '&end-date=' + formObject.endDate;
    }
    // if (formObject.startDate != null) {
    //   searchString = searchString + '&start-date=' + formObject.startDate;
    // }
    // if (formObject.startDate != null) {
    //   searchString = searchString + '&end-date=' + formObject.endDate;
    // }

    this.service.search(searchString).subscribe(
      (data) => {
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
      },
      (err) => {
        console.error(err);
      }
    );
    searchString = '';
  }

  public resetPageSize() {
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.dataSource.paginator.length = this.totalElements;
    }, 500);
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

  // Add dialog
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
