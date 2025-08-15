import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/** Importamos componentes propios, tambien lo colocamos en declaraciones y exports */
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

/** Importamos componetes de Ionic */
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { RouterModule } from '@angular/router';
import { LoadFileComponent } from './components/load-file/load-file.component';
import { RecepcionComponent } from './components/recepcion/recepcion.component';
import { AutorizadorComponent } from './components/autorizador/autorizador.component';
import { ContabilidadComponent } from './components/contabilidad/contabilidad.component';
import { TesoreriaComponent } from './components/tesoreria/tesoreria.component';
import { ConciliacionComponent } from './components/conciliacion/conciliacion.component';
import { ConciRecepComponent } from './components/conci-recep/conci-recep.component';
import { CruzadosComponent } from './components/cruzados/cruzados.component';
import { FinalizadasComponent } from './components/finalizadas/finalizadas.component';
import { AnulacionComponent } from './components/anulacion/anulacion.component';

/**  Componentes */

@NgModule({
  declarations: [ HeaderComponent, CustomInputComponent, LogoComponent, SideMenuComponent, LoadFileComponent, RecepcionComponent, AutorizadorComponent, ContabilidadComponent, TesoreriaComponent, ConciliacionComponent, ConciRecepComponent, CruzadosComponent, FinalizadasComponent, AnulacionComponent ],
  imports: [ CommonModule, IonicModule, ReactiveFormsModule, FormsModule, RouterModule ],
  exports:[ReactiveFormsModule, HeaderComponent, CustomInputComponent, LogoComponent, SideMenuComponent, LoadFileComponent, RecepcionComponent, AutorizadorComponent, ContabilidadComponent, TesoreriaComponent, ConciliacionComponent, ConciRecepComponent, CruzadosComponent, FinalizadasComponent, AnulacionComponent ]
})

export class SharedModule { }

/** Importamos IonicModule ,  ReactiveFormsModule,  FormsModule*/
/**  Se declara y se exporta  HeaderComponent, CustomInputComponent, LogoComponent */
/**  Se importa y exporta ReactiveFormsModule   */


/** Tambien es necesario importar share.module.ts en cada componente  en el module.ts  donde se vaya a usar, ejemplo registrar
 * y olivde contraseña
*/


/** Componentes del proyecto
 * ionic g c shared/components/student  : formulario estudiantes
 * 
 */