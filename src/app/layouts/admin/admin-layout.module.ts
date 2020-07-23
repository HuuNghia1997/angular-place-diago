import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminLayoutSidenavComponent } from './admin-layout-sidenav/admin-layout-sidenav.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminLayoutSidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    AdminLayoutComponent,
    AdminLayoutSidenavComponent
  ]
})
export class AdminLayoutModule { }
