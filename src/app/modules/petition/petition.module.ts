import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { PetitionRoutingModule } from './petition-routing.module';
import { ListPetitionComponent } from './pages/list-petition/list-petition.component';
import { DetailPetitionComponent } from './pages/detail-petition/detail-petition.component';
import { ConfirmationCompletedComponent } from './dialog/confirmation-completed/confirmation-completed.component';
import { ShowProcessComponent } from './dialog/show-process/show-process.component';
import { UpdatePetitionComponent } from './dialog/update-petition/update-petition.component';
import { UpdateResultComponent } from './dialog/update-result/update-result.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule
} from '@angular-material-components/datetime-picker';
import { CommentComponent } from './dialog/comment/comment.component';
import { PreviewLightboxComponent } from './dialog/preview-lightbox/preview-lightbox.component';

@NgModule({
  declarations: [
    ListPetitionComponent,
    DetailPetitionComponent,
    ConfirmationCompletedComponent,
    ShowProcessComponent,
    UpdatePetitionComponent,
    UpdateResultComponent,
    CommentComponent,
    PreviewLightboxComponent
  ],
  imports: [
    CommonModule,
    PetitionRoutingModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule
  ],
  entryComponents: [
    ConfirmationCompletedComponent,
    ShowProcessComponent,
    UpdatePetitionComponent,
    UpdateResultComponent,
    CommentComponent
  ],
  providers: [
    DatePipe
  ]
})
export class PetitionModule { }
