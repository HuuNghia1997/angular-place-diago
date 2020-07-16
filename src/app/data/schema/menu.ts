export interface Menu {
  mainMenu: string;
  icon: string;
  code: string;
  listSubMenu?: ListSubmenu[];
}

export interface ListSubmenu {
  title: string;
  route: string;
  role?: Role[];
}

export interface Role {
  id: number;
  role: string;
}

export const MENU_DATA: Menu[] = [
  {
    mainMenu: 'Cổng thông tin',
    icon: 'file_copy',
    code: 'quan-tri-thong-bao',
    listSubMenu: [
      {
        title: 'Quản trị thông báo',
        route: 'quan-tri-thong-bao',
        role: [
          {
            id: 1,
            role: 'admin'
          },
          {
            id: 2,
            role: 'citizens_notification_manager'
          },
          {
            id: 3,
            role: 'citizens_admin'
          }
        ]
      }
    ]
  },
  {
    mainMenu: 'Phản ánh',
    icon: 'file_copy',
    code: 'cau-hinh-phan-anh',
    listSubMenu: [
      {
        title: 'Tiếp nhận phản ánh',
        route: 'tiep-nhan-phan-anh',
        role: [
          {
            id: 1,
            role: 'admin'
          },
          {
            id: 2,
            role: 'citizens_petition_accepter'
          },
          {
            id: 3,
            role: 'citizens_admin'
          }
        ]
      },
      {
        title: 'Xử lý phản ánh',
        route: 'xu-ly-phan-anh',
        role: [
          {
            id: 1,
            role: 'admin'
          },
          {
            id: 2,
            role: 'citizens_petition_resolver'
          },
          {
            id: 3,
            role: 'citizens_admin'
          }
        ]
      },
      {
        title: 'Tất cả phản ánh',
        route: 'tat-ca-phan-anh',
        role: [
          {
            id: 1,
            role: 'admin'
          },
          {
            id: 2,
            role: 'citizens_petition_manager'
          },
          {
            id: 3,
            role: 'citizens_admin'
          }
        ]
      },
      {
        title: 'Cấu hình phản ánh',
        route: 'cau-hinh-phan-anh',
        role: [
          {
            id: 1,
            role: 'admin'
          },
          {
            id: 2,
            role: 'citizens_admin'
          }
        ]
      }
    ]
  }
];
