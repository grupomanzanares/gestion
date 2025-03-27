import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { ModalService } from 'src/app/services/modal.service';
import { LoadFileComponent } from 'src/app/shared/components/load-file/load-file.component';
import { RecepcionComponent } from 'src/app/shared/components/recepcion/recepcion.component';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
  standalone: false
})
export class DocumentosPage implements OnInit {

  documentos: any [] = []

  constructor(private master: MasterService,
    private _modalService: ModalService
  ) { }

  ngOnInit() {
    this.get()
  }

  get() {
    this.master.get("compras_reportadas").subscribe({
      next: (data) => {
        this.documentos = data
        console.log(data)
      }
    })
  }


/**VentanaModal para crear o modificar */
  async modalRegister(){
    
    try {
      let success = await this._modalService.openModal({
        component: LoadFileComponent,
        cssClass: 'modal'      
      });
      
      if (success) this.get();
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  async modalAsignacion(item: any){
    try {
      let success = await this._modalService.openModal({
        component: RecepcionComponent,
        componentProps: { documento: item },
        cssClass: 'modal'
      });
      if (success) this.get()
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  /** Ciclo de Vida por lo que usamos modal +   */
  // ionViewWillEnter(){
  //   this.get();
  // }

}


