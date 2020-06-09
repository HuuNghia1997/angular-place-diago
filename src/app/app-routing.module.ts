import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from 'env/environment';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'error',
    loadChildren: () => import('modules/error/error.module').then(m => m.ErrorModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('modules/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'petition',
    loadChildren: () => import('modules/petition/petition.module').then(m => m.PetitionModule)
  },
  {
    path: 'config-petition',
    loadChildren: () => import('modules/config-petition/config-petition.module').then(m => m.ConfigPetitionModule)
  },
  {
    path: '**',
    redirectTo: 'error/page-not-found'
  },
];

if (environment.defaultRouterLink) {
  routes.unshift(
    {
      path: '',
      redirectTo: environment.defaultRouterLink,
      pathMatch: 'full'
    },
  );
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, environment.routerConfig)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
