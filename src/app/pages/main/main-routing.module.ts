import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainPage
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'documentos',
    loadChildren: () => import('./documentos/documentos.module').then( m => m.DocumentosPageModule)
  },
  {
    path: 'autorizar',
    loadChildren: () => import('./autorizar/autorizar.module').then( m => m.AutorizarPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'contabilizar',
    loadChildren: () => import('./contabilizar/contabilizar.module').then( m => m.ContabilizarPageModule)
  },
  {
    path: 'trazabilidad',
    loadChildren: () => import('./trazabilidad/trazabilidad.module').then( m => m.TrazabilidadPageModule)
  },
  {
    path: 'tesoreria',
    loadChildren: () => import('./tesoreria/tesoreria.module').then( m => m.TesoreriaPageModule)
  },
  {
    path: 'conciliacion',
    loadChildren: () => import('./conciliacion/conciliacion.module').then( m => m.ConciliacionPageModule)
  },
  {
    path: 'dian',
    loadChildren: () => import('./dian/dian.module').then( m => m.DianPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
