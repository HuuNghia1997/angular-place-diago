import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MENU_DATA } from 'src/app/data/schema/menu';
import { Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-admin-layout-sidenav',
  templateUrl: './admin-layout-sidenav.component.html',
  styleUrls: ['./admin-layout-sidenav.component.scss']
})
export class AdminLayoutSidenavComponent implements OnInit {

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
    // console.log(this.keycloakService.getKeycloakInstance().token);

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
