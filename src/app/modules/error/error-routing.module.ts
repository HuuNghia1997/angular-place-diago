import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { InsufficientPermissionComponent } from './pages/insufficient-permission/insufficient-permission.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
      { path: 'page-not-found', component: PageNotFoundComponent },
      { path: 'insufficient-permission', component: InsufficientPermissionComponent }
    ] 
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ], 
  exports: [
    RouterModule
  ]
})
export class ErrorRoutingModule { }
