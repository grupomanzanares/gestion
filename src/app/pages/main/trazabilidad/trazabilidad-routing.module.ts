import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrazabilidadPage } from './trazabilidad.page';

const routes: Routes = [
  {
    path: '',
    component: TrazabilidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrazabilidadPageRoutingModule {}
