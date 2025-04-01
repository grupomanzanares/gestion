import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutorizarPageRoutingModule } from './autorizar-routing.module';

import { AutorizarPage } from './autorizar.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AutorizarPageRoutingModule,
    SharedModule
  ],
  declarations: [AutorizarPage]
})
export class AutorizarPageModule {}
