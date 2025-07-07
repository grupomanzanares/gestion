import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { ToastService } from 'src/app/services/toast.service';
import { TesoreriaComponent } from 'src/app/shared/components/tesoreria/tesoreria.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tesoreria',
  templateUrl: './tesoreria.page.html',
  styleUrls: ['./tesoreria.page.scss'],
  standalone: false
})
export class TesoreriaPage implements OnInit {

  documentos: any[] = []

  constructor(private master: MasterService, private modalService: ModalService, private toast: ToastService, private loading: LoadingService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    // this.loading.showLoading()
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        const filtrados = data.filter((item: any) => item.compras_estado?.id === 5 && item.tesoreria === false)
        const ordenados = filtrados.sort((a, b) => b.id - a.id)

        this.documentos = ordenados
        // this.loading.hideLoading()
      }
    })
  }
  
  async modalAsignacion(item: any) {
    try {
      let success = await this.modalService.openModal({
        component: TesoreriaComponent,
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
