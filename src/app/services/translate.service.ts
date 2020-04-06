import { Injectable } from '@angular/core';
import { translatePaginator } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TranslateService {
    constructor() { }

    // Dịch các lable của phân trang
    translatePaginator(paginator) {
        const getRangeLabel = (page: number, pageSize: number, length: number) => {
            if (length === 0 || pageSize === 0) {
                return `0 ` + translatePaginator[5] + ` ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
            return `${startIndex + 1} – ${endIndex} ` + translatePaginator[5] + ` ${length}`;
        };
        paginator._intl.itemsPerPageLabel = translatePaginator[0];
        paginator._intl.firstPageLabel = translatePaginator[1];
        paginator._intl.nextPageLabel = translatePaginator[3];
        paginator._intl.previousPageLabel = translatePaginator[2];
        paginator._intl.lastPageLabel = translatePaginator[4];
        paginator._intl.getRangeLabel = getRangeLabel;
    }
}
