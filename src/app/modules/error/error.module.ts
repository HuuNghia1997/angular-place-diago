import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorRoutingModule } from './error-routing.module';
import { InsufficientPermissionComponent } from './pages/insufficient-permission/insufficient-permission.component';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';


@NgModule({
  declarations: [PageNotFoundComponent, InsufficientPermissionComponent],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    AdminLayoutModule
  ]
})
export class ErrorModule { }
