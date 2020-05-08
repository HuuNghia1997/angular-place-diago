import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenAuthComponent } from './components/token-auth/token-auth.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/notification/notification.module').then( m => m.NotificationModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./components/notification/notification.module').then( m => m.NotificationModule)
  },
  {
    path: 'oauth',
    component: TokenAuthComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
