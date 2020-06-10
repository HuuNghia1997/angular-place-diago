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
      onLoad: 'check-sso'
    },
  },
  routerConfig: {
    enableTracing: false
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
          path: 'ba'
        },
        {
          name: 'basecat',
          path: 'bt'
        },
        {
          name: 'fileman',
          path: 'fi'
        },
        {
          name: 'custom',
          path: 'cu'
        },
        {
          name: 'human',
          path: 'hu'
        },
        {
          name: 'postman',
          path: 'po'
        },
        {
          name: 'logman',
          path: 'lo'
        }
      ]
    }
  ]
};
