import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CruzarPageRoutingModule } from './cruzar-routing.module';

import { CruzarPage } from './cruzar.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CruzarPageRoutingModule,
    SharedModule
  ],
  declarations: [CruzarPage]
})
export class CruzarPageModule {}
