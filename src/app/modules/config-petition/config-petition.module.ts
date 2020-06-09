import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigPetitionRoutingModule } from './config-petition-routing.module';
import { ListConfigPetitionComponent } from './pages/list-config-petition/list-config-petition.component';
import { DetailConfigPetitionComponent } from './pages/detail-config-petition/detail-config-petition.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddProcessComponent } from './dialog/add-process/add-process.component';
import { UpdateProcessComponent } from './dialog/update-process/update-process.component';
import { DeleteProcessComponent } from './dialog/delete-process/delete-process.component';
import { ApplyProcessComponent } from './dialog/apply-process/apply-process.component';
import { ShowProcessComponent } from './dialog/show-process/show-process.component';
import { DrawProcessComponent } from './dialog/draw-process/draw-process.component';
import { UnapplyProcessComponent } from './dialog/unapply-process/unapply-process.component';


@NgModule({
  declarations: [
    ListConfigPetitionComponent,
    DetailConfigPetitionComponent,
    AddProcessComponent,
    UpdateProcessComponent,
    DeleteProcessComponent,
    ApplyProcessComponent,
    ShowProcessComponent,
    DrawProcessComponent,
    UnapplyProcessComponent
  ],
  imports: [
    CommonModule,
    ConfigPetitionRoutingModule,
    SharedModule
  ],
  entryComponents: [
    AddProcessComponent,
    UpdateProcessComponent,
    DeleteProcessComponent,
    ApplyProcessComponent,
    ShowProcessComponent,
    DrawProcessComponent
  ]
})
export class ConfigPetitionModule { }
