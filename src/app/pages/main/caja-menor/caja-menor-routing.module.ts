import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CajaMenorPage } from './caja-menor.page';

const routes: Routes = [
  {
    path: '',
    component: CajaMenorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CajaMenorPageRoutingModule {}
