import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcceptPetitionRoutingModule } from './accept-petition-routing.module';
import { ListAcceptPetitionComponent } from './pages/list-accept-petition/list-accept-petition.component';
import { DetailAcceptPetitionComponent } from './pages/detail-accept-petition/detail-accept-petition.component';
import { AddPetitionComponent } from './dialog/add-petition/add-petition.component';
import { EditPetitionComponent } from './dialog/edit-petition/edit-petition.component';
import { DeletePetitionComponent } from './dialog/delete-petition/delete-petition.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { AcceptPetitionComponent } from './dialog/accept-petition/accept-petition.component';

@NgModule({
  declarations: [
    ListAcceptPetitionComponent,
    DetailAcceptPetitionComponent,
    AddPetitionComponent,
    EditPetitionComponent,
    DeletePetitionComponent,
    AcceptPetitionComponent,
  ],
  imports: [
    CommonModule,
    AcceptPetitionRoutingModule,
    SharedModule,
    FileUploadModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
  ],
})
export class AcceptPetitionModule {}
