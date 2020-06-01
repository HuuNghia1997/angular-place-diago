import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { DetailConfigPetitionComponent } from './pages/detail-config-petition/detail-config-petition.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { ListConfigPetitionComponent } from './pages/list-config-petition/list-config-petition.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: ListConfigPetitionComponent
      },
      {
        path: 'detail/:id',
        component: DetailConfigPetitionComponent
      }
    ],
    canActivate: [AuthGuard],
    data: {
      roles: ['ACTIVITI_ADMIN']
    }
  }
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
export class ConfigPetitionRoutingModule { }
