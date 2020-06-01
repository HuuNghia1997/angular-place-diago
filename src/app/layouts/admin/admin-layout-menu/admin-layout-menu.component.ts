import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout-menu',
  templateUrl: './admin-layout-menu.component.html',
  styleUrls: ['./admin-layout-menu.component.scss']
})
export class AdminLayoutMenuComponent implements OnInit {

  position: string;
  sidebarMenu = [
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

  constructor() { }

  ngOnInit(): void {
    this.setOpenAccordion();
  }

  setOpenAccordion() {
    const path = window.location.pathname;
    this.position = path.split('/', 2)[1];
  }

}
