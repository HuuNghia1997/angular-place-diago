import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MENU_DATA } from 'src/app/data/schema/menu';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-admin-layout-menu',
  templateUrl: './admin-layout-menu.component.html',
  styleUrls: ['./admin-layout-menu.component.scss']
})
export class AdminLayoutMenuComponent implements OnInit {

  position: string;
  sidebarMenu = MENU_DATA;
  roleUser = [];
  count = 0;
  countAvailableMenu = [];

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.setOpenAccordion();
    this.roleUser = this.keycloakService.getUserRoles(true);

    MENU_DATA.forEach(e => {
      e.listSubMenu.forEach(r => {
        this.roleUser.forEach(k => {
          if (r.role === k) {
            this.count = this.count + 1;
          }
        });
      });
      this.countAvailableMenu.push(this.count);
      this.count = 0;
    });
  }

  setOpenAccordion() {
    const path = window.location.pathname;
    this.position = path.split('/', 2)[1];
  }

}
