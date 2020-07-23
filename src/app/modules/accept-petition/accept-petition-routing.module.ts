import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { ListAcceptPetitionComponent } from './pages/list-accept-petition/list-accept-petition.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';
import { DetailAcceptPetitionComponent } from './pages/detail-accept-petition/detail-accept-petition.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: ListAcceptPetitionComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: DetailAcceptPetitionComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: {
      anyRoles: ['admin', 'citizens_petition_accepter', 'citizens_admin'],
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutModule],
  exports: [RouterModule],
})
export class AcceptPetitionRoutingModule {}
