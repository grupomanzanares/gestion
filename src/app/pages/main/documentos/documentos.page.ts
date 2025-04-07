import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { ModalService } from 'src/app/services/modal.service';
import { LoadFileComponent } from 'src/app/shared/components/load-file/load-file.component';
import { RecepcionComponent } from 'src/app/shared/components/recepcion/recepcion.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
  standalone: false
})
export class DocumentosPage implements OnInit {

  documentos: any[] = []

  constructor(private master: MasterService, private _modalService: ModalService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    this.master.get("compras_reportadas").subscribe({
      next: (data) => {
        this.documentos = data.filter((item: any) => item.compras_estado?.id === 1)
        console.log(this.documentos)
      }
    })
  }

  /**VentanaModal para crear o modificar */
  async modalRegister() {

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

  async modalAsignacion(item: any) {
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

  union(item: any) {
    const url = environment.apiUrl;
    const pdf = item.urlPdf;

    if (pdf) {
      const urlpdf = url + pdf;
      window.open(urlpdf, '_blank'); // Abre el PDF en nueva pestaña
    } else {
      console.warn('No hay URL de PDF disponible');
    }
  }

}


