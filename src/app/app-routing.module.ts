import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '', 
    component: DashboardComponent 
  },
  {
    path: 'notification',
    loadChildren: './components/notification/notification.module#NotificationModule'
  },
  {
    path: 'notification/detail/:id',
    loadChildren: './components/notification/detail-notification/detail-notification.module#DetailNotificationModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
