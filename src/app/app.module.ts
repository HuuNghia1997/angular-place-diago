import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { NotificationModule } from './components/notification/notification.module';
import { DetailNotificationModule } from './components/notification/detail-notification/detail-notification.module';

// services
import { NotificationService } from './services/notification.service';
import { TranslateService } from './services/translate.service';
import { OauthService } from './services/oauth.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenAuthComponent } from './components/token-auth/token-auth.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCompressService, ResizeOptions, ImageUtilityService } from 'ng2-image-compress';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    TokenAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SidebarModule,
    NotificationModule,
    DetailNotificationModule,
  ],
  providers: [
    NotificationService,
    TranslateService,
    OauthService,
    NgxImageCompressService,
    ImageCompressService,
    ResizeOptions
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
