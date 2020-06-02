import { Component, OnInit } from '@angular/core';
import { MENU_DATA } from 'src/app/data/schema/menu';

@Component({
  selector: 'app-admin-layout-menu',
  templateUrl: './admin-layout-menu.component.html',
  styleUrls: ['./admin-layout-menu.component.scss']
})
export class AdminLayoutMenuComponent implements OnInit {

  position: string;
  sidebarMenu = MENU_DATA;
  panelOpenState = true;

  constructor() { }

  ngOnInit(): void {
    this.setOpenAccordion();
  }

  setOpenAccordion() {
    const path = window.location.pathname;
    this.position = path.split('/', 2)[1];
  }
}
