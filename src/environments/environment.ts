export const environment = {
    production: false
};

export const tokenURL = 'https://digo-sso.vnptigate.vn/oauth/token';

export const rootURL = 'https://digo-api.vnptigate.vn/';

export const AUTH = {
    GRANT_TYPE: 'client_credentials',
    CLIENT_ID: 'first-client',
    CLIENT_SECRET: '123',
    USER_NAME: '+84941707439',
    PWD: 'Vnpt@123654'
};

export const siteName = 'Chính Quyền Số';

export const notificationHistoryGroupId = 3;

export const notificationCategoryId = '6';

// Dịch các lable của phân trang
export const translatePaginator = ['Số dòng', 'Trang đầu', 'Trang trước', 'Trang tiếp theo', 'Trang cuối', 'của'];

// Datetime picker format
export const PICK_FORMATS = {
    parse: { dateInput: { month: 'short', year: 'numeric', day: 'numeric' } },
    display: {
        dateInput: 'input',
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
};

export const reloadTimeout = 2500; // milisecond
export const pageSizeOptions = [5, 10, 20, 50, 100];

