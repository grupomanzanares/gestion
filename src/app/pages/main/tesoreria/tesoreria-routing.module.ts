import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TesoreriaPage } from './tesoreria.page';

const routes: Routes = [
  {
    path: '',
    component: TesoreriaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TesoreriaPageRoutingModule {}
