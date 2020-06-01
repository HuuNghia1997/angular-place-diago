import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from 'src/app/layouts/admin/admin-layout/admin-layout.component';
import { ListPetitionComponent } from './pages/list-petition/list-petition.component';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { AdminLayoutModule } from 'src/app/layouts/admin/admin-layout.module';
import { DetailPetitionComponent } from './pages/detail-petition/detail-petition.component';


const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: ListPetitionComponent
      },
      {
        path: 'detail/:id',
        component: DetailPetitionComponent
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
  exports: [RouterModule]
})
export class PetitionRoutingModule { }
