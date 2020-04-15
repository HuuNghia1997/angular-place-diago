import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// ====================================================== Services
import { NotificationService } from '../../services/notification.service';
import { TranslateService } from '../../services/translate.service';
import { MainService } from '../../services/main.service';

// ====================================================== Environment
import { PICK_FORMATS, pageSizeOptions, notificationCategoryId } from '../../../environments/environment';

// ====================================================== Table dataSource

export interface PeriodicElement {
}

class PickDateAdapter extends NativeDateAdapter {
    format(date: Date, displayFormat): string {
        if (displayFormat === 'input') {
            return formatDate(date, 'dd/MM/yyyy', this.locale);
        } else {
            return date.toDateString();
        }
    }
}

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss', '../../app.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: PickDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: PICK_FORMATS },
        DatePipe
    ]
})
export class NotificationComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['stt', 'title', 'agency', 'catalogy', 'created_at', 'status', 'endDate', 'options'];
    ELEMENTDATA: PeriodicElement[] = [];
    dataSource: MatTableDataSource<PeriodicElement>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;

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
        endDate: new FormControl('')
    });

    listTags = [];

    listAgency = [
        { id: 1, imageId: '5e806566e0729747af9d136a', name: 'UBND Thành phố Mỹ Tho' },
        { id: 2, imageId: '5e806566e0729747af9d136a', name: 'UBND Thành phố Cần Thơ' },
        { id: 3, imageId: '5e806566e0729747af9d136a', name: 'UBND Thị xã Cai Lậy' }
    ];

    result: boolean;

    constructor(
        private service: NotificationService,
        private translator: TranslateService,
        private router: Router,
        private main: MainService,
        public datepipe: DatePipe,
        private cdRef: ChangeDetectorRef
    ) {
        this.dataSource = new MatTableDataSource(this.ELEMENTDATA);
        service.registerMyApp(this);
    }

    ngOnInit(): void {
        this.search(0, pageSizeOptions[1]);
        this.getListTags();
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = pageSizeOptions[1];
        this.dataSource.sort = this.sort;
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
            this.service.checkErrorResponse(err, 2);
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
        searchString = searchString + '&title=' + formObj.title;

        for (const i of formObj.tag) {
            searchString = searchString + '&tag-id=' + i;
        }

        searchString = searchString + '&agency-id=' + formObj.agency;

        searchString = searchString + '&publish=' + formObj.publish;

        formObj.startDate = this.datepipe.transform(formObj.startDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
        if (formObj.startDate != null) {
            formObj.startDate = formObj.startDate.replace('+', '%2B');
        }
        formObj.endDate = this.datepipe.transform(formObj.endDate, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSZ');
        if (formObj.endDate != null) {
            formObj.endDate = formObj.endDate.replace('+', '%2B');
        }
        searchString = searchString + '&start-date=' + formObj.startDate;
        searchString = searchString + '&end-date=' + formObj.endDate;

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
        }, err => {
            this.service.checkErrorResponse(err, 1);
        });
    }
}
