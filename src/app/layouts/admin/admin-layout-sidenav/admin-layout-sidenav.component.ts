import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MENU_DATA, Menu, Role, ListSubmenu } from 'src/app/data/schema/menu';
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
  countRoute = 0;

  constructor(private keycloakService: KeycloakService) {
  }

  ngOnInit(): void {
    this.setOpenAccordion();
    this.roleUser = this.keycloakService.getUserRoles(true);

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

  matchPosition(position: string, route: ListSubmenu[]) {
    this.countRoute = 0;
    route.forEach(r => {
      if (r.route === position) {
        this.countRoute = this.countRoute + 1;
      }
    });
    if (this.countRoute > 0) {
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
