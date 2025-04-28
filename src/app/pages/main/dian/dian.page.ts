import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { ModalService } from 'src/app/services/modal.service';
import { ConciliacionComponent } from 'src/app/shared/components/conciliacion/conciliacion.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dian',
  templateUrl: './dian.page.html',
  styleUrls: ['./dian.page.scss'],
  standalone: false
})
export class DianPage implements OnInit {

  documentos: any[] = []

  constructor(private master: MasterService, private modalService: ModalService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    this.master.get("registros_dian").subscribe({
      next: (data) => {
        this.documentos = data
        console.log(data)
      }
    })
  }

  async modalRegister() {

    try {
      let success = await this.modalService.openModal({
        component: ConciliacionComponent,
        cssClass: 'modal'
      });

      if (success) this.get();
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
