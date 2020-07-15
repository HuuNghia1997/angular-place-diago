// Dịch các lable của phân trang
export const translatePaginator = ['Số dòng', 'Trang đầu', 'Trang trước', 'Trang tiếp theo', 'Trang cuối', 'của'];

// Date picker format
export const PICK_FORMATS = {
  parse: {
    dateInput: {
      month: 'short',
      year: 'numeric',
      day: 'numeric'
    }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: {
      year: 'numeric',
      month: 'short'
    },
    dateA11yLabel: {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    },
    monthYearA11yLabel: {
      year: 'numeric',
      month: 'long'
    }
  }
};

export const reloadTimeout = 2500; // milisecond
export const pageSizeOptions = [5, 10, 20, 50];
export const notificationHistoryGroupId = 3;
export const notificationCategoryId = '6';
export const petitionHistoryGroupId = 2;
export const petitionCommentGroupId = 1;
export const petitionCategoryId = '3';
export const petitionAcceptFileExtension = ['.jpg', 'jpeg', '.png', '.mp3', '.mp4', '.txt', '.pdf'];
export const petitionAcceptFileType = ['audio/mpeg', 'image/jpeg', 'image/png', 'image/jpg', 'text/plain', 'application/pdf' ];
