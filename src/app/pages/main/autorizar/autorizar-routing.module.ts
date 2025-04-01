import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarPage } from './autorizar.page';

const routes: Routes = [
  {
    path: '',
    component: AutorizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorizarPageRoutingModule {}
