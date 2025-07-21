import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagramaPage } from './diagrama.page';

const routes: Routes = [
  {
    path: '',
    component: DiagramaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagramaPageRoutingModule {}
