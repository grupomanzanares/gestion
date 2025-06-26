import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { StorageService } from 'src/app/services/storage.service';
import { AutorizadorComponent } from 'src/app/shared/components/autorizador/autorizador.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-autorizar',
  templateUrl: './autorizar.page.html',
  styleUrls: ['./autorizar.page.scss'],
  standalone: false
})
export class AutorizarPage implements OnInit {

  documentos: any[] = []
  user = {} as any;

  constructor(private master: MasterService, private modalService: ModalService, private storage: StorageService, private loading: LoadingService) { }

  ngOnInit() {
    this.get()
    this.user = this.storage.get('manzanares-user')
  }

  get() {
    this.master.get("compras_reportadas").subscribe({
      next: (data) => {
        this.documentos = data.filter((item: any) => item.compras_estado?.id === 2 && item.responsableId === this.user.id)
        console.log(this.documentos)
      }
    })
  }

  async modalAutorizador(item: any) {
    try {
      let success = await this.modalService.openModal({
        component: AutorizadorComponent,
        componentProps: { documento: item },
        cssClass: 'modaltow'
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
