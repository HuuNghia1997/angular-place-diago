import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllPetitionRoutingModule } from './all-petition-routing.module';
import { ListAllPetitionComponent } from './pages/list-all-petition/list-all-petition.component';
import { DetailAllPetitionComponent } from './pages/detail-all-petition/detail-all-petition.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
} from '@angular-material-components/datetime-picker';
import { ShowProcessAllPetitionComponent } from './dialog/show-process-all-petition/show-process-all-petition.component';
import { GoogleMapsModule } from "@angular/google-maps";
import { GoogleMapAllPetitionComponent } from './dialog/google-map-all-petition/google-map-all-petition.component';

@NgModule({
  declarations: [
    ListAllPetitionComponent,
    DetailAllPetitionComponent,
    ShowProcessAllPetitionComponent,
    GoogleMapAllPetitionComponent
  ],
  imports: [
    CommonModule,
    AllPetitionRoutingModule,
    SharedModule,
    FileUploadModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    GoogleMapsModule
  ],
})
export class AllPetitionModule {}
