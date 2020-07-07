import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcceptPetitionRoutingModule } from './accept-petition-routing.module';
import { ListAcceptPetitionComponent } from './pages/list-accept-petition/list-accept-petition.component';
import { DetailAcceptPetitionComponent } from './pages/detail-accept-petition/detail-accept-petition.component';
import { AddPetitionComponent } from './dialog/add-petition/add-petition.component';
import { EditPetitionComponent } from './dialog/edit-petition/edit-petition.component';
import { DeletePetitionComponent } from './dialog/delete-petition/delete-petition.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { AcceptPetitionComponent } from './dialog/accept-petition/accept-petition.component';
import { CommentPetitionComponent } from './dialog/comment-petition/comment-petition.component';
import { MapComponent } from './dialog/map/map.component';
import { WorkflowDiagramComponent } from './dialog/workflow-diagram/workflow-diagram.component';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { PreviewImageComponent } from './dialog/preview-image/preview-image.component';


@NgModule({
  declarations: [
    ListAcceptPetitionComponent,
    DetailAcceptPetitionComponent,
    AddPetitionComponent,
    EditPetitionComponent,
    DeletePetitionComponent,
    AcceptPetitionComponent,
    CommentPetitionComponent,
    MapComponent,
    WorkflowDiagramComponent,
    PreviewImageComponent,
  ],
  imports: [
    CommonModule,
    AcceptPetitionRoutingModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    NgxGalleryModule
  ],
})
export class AcceptPetitionModule {}
