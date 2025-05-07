import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CruzarPage } from './cruzar.page';

const routes: Routes = [
  {
    path: '',
    component: CruzarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CruzarPageRoutingModule {}
