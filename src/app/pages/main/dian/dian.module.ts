import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DianPageRoutingModule } from './dian-routing.module';

import { DianPage } from './dian.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DianPageRoutingModule,
    SharedModule
  ],
  declarations: [DianPage]
})
export class DianPageModule {}
