import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CajaMenorPageRoutingModule } from './caja-menor-routing.module';

import { CajaMenorPage } from './caja-menor.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CajaMenorPageRoutingModule,
    SharedModule
  ],
  declarations: [CajaMenorPage]
})
export class CajaMenorPageModule {}
