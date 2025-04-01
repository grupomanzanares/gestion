import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContabilizarPageRoutingModule } from './contabilizar-routing.module';

import { ContabilizarPage } from './contabilizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContabilizarPageRoutingModule
  ],
  declarations: [ContabilizarPage]
})
export class ContabilizarPageModule {}
