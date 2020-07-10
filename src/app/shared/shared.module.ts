import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { SilentCheckSsoComponent } from './components/silent-check-sso/silent-check-sso.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    SilentCheckSsoComponent,
    CustomSnackbarComponent
  ],
  imports: [
    MaterialModule,
    HttpClientModule,
    CarouselModule
  ],
  exports: [
    MaterialModule,
    HttpClientModule,
    CarouselModule
  ]
})
export class SharedModule { }
