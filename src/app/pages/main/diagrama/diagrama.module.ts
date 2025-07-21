import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagramaPageRoutingModule } from './diagrama-routing.module';

import { DiagramaPage } from './diagrama.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagramaPageRoutingModule,
    SharedModule
  ],
  declarations: [DiagramaPage]
})
export class DiagramaPageModule {}
