import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: HomeComponent }
    ],
    canActivate: [AuthGuard],
    data: [
      { roles: ['ACTIVITI_ADMIN']}
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutModule
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
