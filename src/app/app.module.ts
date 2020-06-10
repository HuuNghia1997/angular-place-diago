import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './app-init';
import { NgxImageCompressService } from 'ngx-image-compress';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    KeycloakAngularModule,
    CoreModule,
    SharedModule,

    //add more modules here

    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService]
    },
    NgxImageCompressService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
