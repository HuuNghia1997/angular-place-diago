import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { NotificationModule } from './components/notification/notification.module';
import { DetailNotificationModule } from './components/notification/detail-notification/detail-notification.module';


//services
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { TranslateService } from './services/translate.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
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
    AuthService,
    NotificationService,
    TranslateService
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
