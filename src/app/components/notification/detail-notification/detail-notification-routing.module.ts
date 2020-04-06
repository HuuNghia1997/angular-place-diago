import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailNotificationComponent } from './detail-notification.component';

const routes: Routes = [
  {
    path: '',
    component: DetailNotificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailNotificationRoutingModule { }
