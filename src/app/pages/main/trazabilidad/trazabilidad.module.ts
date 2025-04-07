import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrazabilidadPageRoutingModule } from './trazabilidad-routing.module';

import { TrazabilidadPage } from './trazabilidad.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrazabilidadPageRoutingModule,
    SharedModule
  ],
  declarations: [TrazabilidadPage]
})
export class TrazabilidadPageModule {}
