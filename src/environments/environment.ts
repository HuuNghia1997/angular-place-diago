export const environment = {
    production: false
};

export const tempRedirect = 'redirect_uri=http://localhost:4200/oauth';
// export const tempRedirect = 'redirect_uri=https://digo-citizens-admin.vnptigate.vn/oauth';

export const rootLayout = 'http://localhost:4200/';
// export const rootLayout = 'https://digo-citizens-admin.vnptigate.vn/';

export const tokenURL = 'https://digo-sso.vnptigate.vn/oauth/token';

export const logoutURL = 'https://digo-sso.vnptigate.vn';

export const rootURL = 'https://digo-api.vnptigate.vn/';

export const getCodeURL = 'https://digo-sso.vnptigate.vn/oauth/authorize';

export const AUTH = {
    GRANT_TYPE_CLIENT: 'client_credentials',
    CLIENT_ID: 'first-client',
    CLIENT_SECRET: '123',
    USER_NAME: '+84941707439',
    PWD: 'Vnpt@123654',
    GRANT_TYPE_CODE : 'authorization_code'
};


export const getCodeParams = '?grant_type=' + AUTH.GRANT_TYPE_CODE + '&response_type=code&client_id=' + AUTH.CLIENT_ID + '&state=1234';

export const siteName = 'Chính Quyền Số';

export const notificationHistoryGroupId = 3;

export const notificationCategoryId = '6';

export const token_refresh = 'token_refresh';

export const auth_token = 'auth_token';

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
export const pageSizeOptions = [5, 10, 20, 50];

