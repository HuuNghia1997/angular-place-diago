import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { environment } from 'env/environment';

export function initializer(keycloak: KeycloakService): () => Promise<any> {
  return (): Promise<any> => keycloak.init(<KeycloakOptions> environment.config.keycloakOptions).then(function (authenticated) {
    if (environment.config.keycloakDebug) {
      console.log(authenticated ? 'User authenticated' : 'User not authenticated');
    }
  }).catch(function () {
    console.warn('Failed to initialize keycloak!');
  });
}