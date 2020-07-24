// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  debug: true,
  loadConfigFromUrl: false,
  configUrl: './assets/app.config.json',
  routerConfig: {
    enableTracing: false
  },
  config: {
    keycloakDebug: true,
    keycloakOptions: {
      config: {
        url: 'https://digo-oidc.vnptigate.vn/auth',
        realm: 'digo',
        clientId: 'citizens-admin',
      },
      initOptions: {
        onLoad: 'check-sso'
      },
    },
    insufficientPermissionRouterLink: 'error/insufficient-permission',
    apiProviders: {
      digoMicroservice: {
        rootUrl: 'https://digo-api-01.vnptigate.vn/',
        services: {
          basedata: { path: 'ba' },
          basecat: { path: 'bt' },
          fileman: { path: 'fi' },
          human: { path: 'hu' },
          postman: { path: 'po' },
          surfeed: { path: 'su' },
          models: { path: 'modeling-service/v1' },
          rbPetition: { path: 'rb-petition' },
          messenger: { path: 'me' }
        }
      }
    }
  },
  defaultRouterLink: 'home',
  insufficientPermissionRouterLink: 'error/insufficient-permission',
  mapbox: {
    accessToken:
      'pk.eyJ1IjoibW5oYWktbWFwYm94IiwiYSI6ImNrYmlvZ3d5bjBmdzcyem5xcWhnaDFrYjIifQ.tdsFG-l6QwZeKXDtO_r99g',
  },
  provinceDefaultId: 82,
  notification: {
    maxImageUploadSize:  5
  }
};


export const projectIdProcess = '3f9d9e1b-02cd-4e76-ad98-a67ab9830bf3';
export const typeProcess = 'PROCESS';
export const typeFile = [
  '.JPG, .JPG, .PNG, .JPEG, .GIF, .TIFF, .PSD, .PDF, .EPS, .AI, .INDD, .RAW, .docx, .dot , .pdf, .MP4, .mp3, .doc',
];
export const typeArrImg = [{type:"video",url:"./assets/img/video.png"},{type:"audio",url:"./assets/img/audio.png"},{type:"video",url:"./assets/img/video.jpg"}]
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
