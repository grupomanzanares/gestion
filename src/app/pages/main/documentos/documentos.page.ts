import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { LoadingService } from 'src/app/services/loading.service';
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

  constructor(private master: MasterService, private _modalService: ModalService, private loading: LoadingService, private http: HttpClient, private masterTable: MasterTableService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    this.loading.showLoading()
    this.master.get("compras_reportadas").subscribe({
      next: (data) => {
        const filtrados = data.filter((item: any) => item.compras_estado?.id === 1)
        const ordenados = filtrados.sort((a,b) => b.id - a.id)

        this.documentos = ordenados
        console.log(this.documentos)
        this.loading.hideLoading()
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

  verificacionPDF(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.head(url, { observe: 'response' }).subscribe({
        next: (resp) => resolve(resp.status === 200),
        error: () => resolve(false)
      })
    })
  }

  async update(item: any) {
    const confirmacion = window.confirm('¿Estas segura de anular este documento?');
    if (!confirmacion) return;

    const formData = new FormData();

    formData.append('id', item.id)
    formData.append('userMod', item.user.identificacion);
    formData.append('estadoId', '8');

    console.log('item', item)

    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (res) => {
        this.get()
        console.log(res)
      },
      error: (error) => {
        console.error('Error al autorizar:', error)
      }
    })
  }

}