import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DianPage } from './dian.page';

const routes: Routes = [
  {
    path: '',
    component: DianPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DianPageRoutingModule {}
