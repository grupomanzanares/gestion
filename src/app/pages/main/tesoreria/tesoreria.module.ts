import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TesoreriaPageRoutingModule } from './tesoreria-routing.module';

import { TesoreriaPage } from './tesoreria.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TesoreriaPageRoutingModule,
    SharedModule
  ],
  declarations: [TesoreriaPage]
})
export class TesoreriaPageModule {}
