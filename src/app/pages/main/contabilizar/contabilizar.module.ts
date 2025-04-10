import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContabilizarPageRoutingModule } from './contabilizar-routing.module';

import { ContabilizarPage } from './contabilizar.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContabilizarPageRoutingModule,
    SharedModule
  ],
  declarations: [ContabilizarPage]
})
export class ContabilizarPageModule {}
