import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { SilentCheckSsoComponent } from './components/silent-check-sso/silent-check-sso.component';
import { CustomPopupComponent } from './components/custom-popup/custom-popup.component';

@NgModule({
  declarations: [
    SilentCheckSsoComponent,
    CustomPopupComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule
  ],
  exports: [
    MaterialModule,
    HttpClientModule
  ]
})
export class SharedModule { }
