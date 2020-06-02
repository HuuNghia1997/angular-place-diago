export interface Menu {
  mainMenu: string;
  icon: string;
  code: string;
  listSubMenu?: ListSubmenu[];
}

export interface ListSubmenu {
  title: string;
  route: string;
}

export const MENU_DATA: Menu[] = [
  {
    mainMenu: 'Cổng thông tin',
    icon: 'file_copy',
    code: 'notifications',
    listSubMenu: [
      {
        title: 'Quản trị thông báo',
        route: '/notification'
      }
    ]
  },
  {
    mainMenu: 'Phản ánh',
    icon: 'file_copy',
    code: 'petitions',
    listSubMenu: [
      {
        title: 'Tất cả phản ánh',
        route: '/petition'
      },
      {
        title: 'Cấu hình phản ánh',
        route: '/config-petition'
      }
    ]
  }
];
