import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { ListAllPetitionComponent } from './pages/list-all-petition/list-all-petition.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';
import { DetailAllPetitionComponent } from './pages/detail-all-petition/detail-all-petition.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: ListAllPetitionComponent,
      },
      {
        path: 'chi-tiet/:id',
        component: DetailAllPetitionComponent,
      },
    ],
    canActivate: [AuthGuard],
    data: {
      anyRoles: ['admin', 'citizens_petition_manager', 'citizens_admin'],
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdminLayoutModule],
  exports: [RouterModule],
})
export class AllPetitionRoutingModule {}
