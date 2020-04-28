import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule  } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatTreeModule } from '@angular/material/tree';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { NotificationRoutingModule } from './notification-routing.module';

import { AddNotificationComponent } from '../../dialogs/notification/add-notification/add-notification.component';
import { DeleteNotificationComponent } from '../../dialogs/notification/delete-notification/delete-notification.component';
import { EditNotificationComponent } from '../../dialogs/notification/edit-notification/edit-notification.component';
import { SendNotificationComponent } from '../../dialogs/notification/send-notification/send-notification.component';
import { CustomSnakebarComponent } from '../../custom-snakebar/custom-snakebar.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';

@NgModule({
  declarations: [
    CustomSnakebarComponent,
    AddNotificationComponent,
    DeleteNotificationComponent,
    EditNotificationComponent,
    SendNotificationComponent,
    ListNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    MatSnackBarModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatChipsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatTreeModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTabsModule
  ],
  entryComponents:[
    AddNotificationComponent,
    DeleteNotificationComponent,
    EditNotificationComponent,
    SendNotificationComponent
  ]
})
export class NotificationModule { }
