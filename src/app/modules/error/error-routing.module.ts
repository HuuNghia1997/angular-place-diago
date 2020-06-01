import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { InsufficientPermissionComponent } from './pages/insufficient-permission/insufficient-permission.component';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'page-not-found',
        component: PageNotFoundComponent
      },
      {
        path: 'insufficient-permission',
        component: InsufficientPermissionComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutModule
  ],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
