import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { DetailNotificationComponent } from './detail-notification/detail-notification.component';

const routes: Routes = [
  {
    path: '',
    component: ListNotificationComponent
  },
  {
    path: 'detail/:id',
    component: DetailNotificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
