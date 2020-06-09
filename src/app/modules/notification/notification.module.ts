import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationRoutingModule } from './notification-routing.module';
import { ListNotificationComponent } from './pages/list-notification/list-notification.component';
import { DetailNotificationComponent } from './pages/detail-notification/detail-notification.component';
import { AddNotificationComponent } from './dialog/add-notification/add-notification.component';
import { DeleteNotificationComponent } from './dialog/delete-notification/delete-notification.component';
import { EditNotificationComponent } from './dialog/edit-notification/edit-notification.component';
import { SendNotificationComponent } from './dialog/send-notification/send-notification.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationService } from 'src/app/data/service/notification.service';
import { NgxImageCompressService } from 'ngx-image-compress';


@NgModule({
  declarations: [
    ListNotificationComponent,
    DetailNotificationComponent,
    AddNotificationComponent,
    DeleteNotificationComponent,
    EditNotificationComponent,
    SendNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddNotificationComponent,
    DeleteNotificationComponent,
    EditNotificationComponent,
    SendNotificationComponent
  ]
})
export class NotificationModule { }
