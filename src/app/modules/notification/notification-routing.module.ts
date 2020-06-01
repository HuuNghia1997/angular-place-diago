import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { ListNotificationComponent } from './pages/list-notification/list-notification.component';
import { DetailNotificationComponent } from './pages/detail-notification/detail-notification.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: ListNotificationComponent
      },
      {
        path: 'detail/:id',
        component: DetailNotificationComponent
      }
    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['ACTIVITI_ADMIN']
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutModule
  ],
  exports: [RouterModule]
})
export class NotificationRoutingModule { }
