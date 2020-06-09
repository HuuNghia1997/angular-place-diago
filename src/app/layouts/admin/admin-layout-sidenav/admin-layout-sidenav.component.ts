import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MENU_DATA, Menu, Role } from 'src/app/data/schema/menu';
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
  countSubmenu = 0;
  countAvailableMenu = [];
  countAvailableSubmenu = [];
  check;

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.setOpenAccordion();
    this.roleUser = this.keycloakService.getUserRoles(true);
    // console.log(this.keycloakService.getKeycloakInstance().token);
    console.log(this.roleUser);

    MENU_DATA.forEach(e => {
      e.listSubMenu.forEach(r => {
        r.role.forEach(q => {
          this.roleUser.forEach(k => {
            if (q.role === k) {
              this.count = this.count + 1;
            }
          });
        });
      });
      this.countAvailableMenu.push(this.count);
      console.log(this.countAvailableMenu);
      this.count = 0;
    });
  }

  match(roleUser: any[], roleMenu: Role[]) {
    this.countSubmenu = 0;
    roleUser.forEach(roU => {
      roleMenu.forEach(roM => {
        if (roU === roM.role) {
          this.countSubmenu = this.countSubmenu + 1;
        }
      });
    });
    if (this.countSubmenu > 0) {
      return true;
    } else {
      return false;
    }
  }

  setOpenAccordion() {
    const path = window.location.pathname;
    this.position = path.split('/', 2)[1];
  }

}
