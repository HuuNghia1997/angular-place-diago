// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  debug: true,
  keycloakDebug: true,
  keycloakOptions: {
    config: {
      url: 'https://digo-oidc.vnptigate.vn/auth',
      realm: 'digo',
      clientId: 'citizens-admin',
    },
    initOptions: {
      onLoad: 'check-sso',
    },
  },
  routerConfig: {
    enableTracing: false,
  },
  defaultRouterLink: 'home',
  insufficientPermissionRouterLink: 'error/insufficient-permission',
  apiProviders: [
    {
      name: 'digo-microservice',
      rootUrl: 'https://digo-api-01.vnptigate.vn/',
      services: [
        {
          name: 'basedata',
          path: 'ba',
        },
        {
          name: 'basecat',
          path: 'bt',
        },
        {
          name: 'fileman',
          path: 'fi',
        },
        {
          name: 'custom',
          path: 'cu',
        },
        {
          name: 'human',
          path: 'hu',
        },
        {
          name: 'postman',
          path: 'po',
        },
        {
          name: 'logman',
          path: 'lo',
        },
        {
          name: 'rb-petition',
          path: 'rb-petition'
        }
      ],
    },
  ],
  mapbox: {
    accessToken:
      'pk.eyJ1IjoibW5oYWktbWFwYm94IiwiYSI6ImNrYmlvZ3d5bjBmdzcyem5xcWhnaDFrYjIifQ.tdsFG-l6QwZeKXDtO_r99g',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
