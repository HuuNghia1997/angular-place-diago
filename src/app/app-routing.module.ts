import { NgModule } from '@angular/core';
import { Routes, RouterModule, ExtraOptions } from '@angular/router';
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
    path: 'tiep-nhan-phan-anh',
    loadChildren: () => import('modules/accept-petition/accept-petition.module').then(m => m.AcceptPetitionModule)
  },
  {
    path: 'xu-ly-phan-anh',
    loadChildren: () => import('modules/petition/petition.module').then(m => m.PetitionModule)
  },
  {
    path: 'tat-ca-phan-anh',
    loadChildren: () => import('modules/all-petition/all-petition.module').then(m => m.AllPetitionModule)
  },
  {
    path: 'cau-hinh-phan-anh',
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

const options: ExtraOptions= {
  onSameUrlNavigation: 'reload',
  enableTracing: environment.routerConfig.enableTracing
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes, options)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
