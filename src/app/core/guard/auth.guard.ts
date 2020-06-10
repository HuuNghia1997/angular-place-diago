import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { environment } from 'env/environment';

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

      if (hasAnyRoles && hasAnyRoles.length > 0) {
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

      // var b = hasAnyRoles.every(role => {
      //   console.log(role);
      //   console.log(this.roles.indexOf(role));
      //   return this.roles.indexOf(role) > -1;
      // });

      // var a = hasAnyRoles.some(role => {
      //   console.log(role);
      //   console.log(this.roles.indexOf(role));
      //   return this.roles.indexOf(role) > -1;
      // });

      // console.log(a);
      // console.log(b);

    //   hasAnyRoles.forEach(role => {
    //       console.log(this.roles.indexOf(role));
    //   });

    //   function isBigEnough(element, index, array) {
    //     console.log(this.roles.indexOf(element));

    //     return (element >= 10);

    //  }

    //  var retval = [2, 5, 8, 1, 4].some(isBigEnough);
    //  console.log("Returned value is : " + retval );

    //  var retval = [12, 5, 8, 1, 4].some(isBigEnough);
    //  console.log("Returned value is : " + retval );

      return resolve(true);
    });
  }

}
