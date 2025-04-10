import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConciliacionPage } from './conciliacion.page';

const routes: Routes = [
  {
    path: '',
    component: ConciliacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliacionPageRoutingModule {}
