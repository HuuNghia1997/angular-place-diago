export interface Menu {
  mainMenu: string;
  icon: string;
  code: string;
  listSubMenu?: ListSubmenu[];
}

export interface ListSubmenu {
  title: string;
  route: string;
  role: string;
}

export const MENU_DATA: Menu[] = [
  {
    mainMenu: 'Cổng thông tin',
    icon: 'file_copy',
    code: 'notification',
    listSubMenu: [
      {
        title: 'Quản trị thông báo',
        route: 'notification',
        role: 'ACTIVITI_ADMIN'
      }
    ]
  },
  {
    mainMenu: 'Phản ánh',
    icon: 'file_copy',
    code: 'petition',
    listSubMenu: [
      {
        title: 'Tất cả phản ánh',
        route: 'petition',
        role: 'ACTIVITI_ADMIN'
      },
      {
        title: 'Cấu hình phản ánh',
        route: 'config-petition',
        role: 'ACTIVITI_ADMIN'
      }
    ]
  }
];
