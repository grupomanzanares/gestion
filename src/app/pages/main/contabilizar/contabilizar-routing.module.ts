import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizarPage } from './contabilizar.page';

const routes: Routes = [
  {
    path: '',
    component: ContabilizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContabilizarPageRoutingModule {}
