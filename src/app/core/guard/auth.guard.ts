import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {

  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {

      if (!this.authenticated) {
        this.keycloakAngular.login().catch(e => console.error(e));
        return reject(false);
      }

      const hasRoles: string[] = route.data.roles;
      const hasAnyRoles: string[] = route.data.anyRoles;
      if (hasRoles && hasRoles.length > 0) {
        if (!this.roles || this.roles.length === 0) {
          this.router.navigate([environment.insufficientPermissionRouterLink]);
          return resolve(false);
        }
        if (hasRoles.every(role => this.roles.indexOf(role) > -1)) {
          return resolve(true);
        }
        this.router.navigate([environment.insufficientPermissionRouterLink]);
        return resolve(false);
      }

      if (hasAnyRoles && hasAnyRoles.length === 0) {
        if (!this.roles || this.roles.length === 0) {
          this.router.navigate([environment.insufficientPermissionRouterLink]);
          return resolve(false);
        }
        if (hasAnyRoles.some(role => this.roles.indexOf(role) > -1)) {
          return resolve(true);
        }
        this.router.navigate([environment.insufficientPermissionRouterLink]);
        return resolve(false);
      }

      return resolve(true);
    });
  }

}
