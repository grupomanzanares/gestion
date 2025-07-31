import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { FinalizadasComponent } from 'src/app/shared/components/finalizadas/finalizadas.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-finalizadas',
  templateUrl: './finalizadas.page.html',
  styleUrls: ['./finalizadas.page.scss'],
  standalone: false
})
export class FinalizadasPage implements OnInit {

  documentos: any[] = []

  constructor(private master: MasterService, private modalService: ModalService, private loadig: LoadingService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    this.loadig.showLoading()
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        const filtrados = data.filter((item: any) => item.compras_estado?.id === 7)
        const ordenados = filtrados.sort((a, b) => b.id - a.id)

        this.documentos = ordenados
        this.loadig.hideLoading()
      }
    })
  }

  async modalFin(item: any) {
    try {
      let success = await this.modalService.openModal({
        component: FinalizadasComponent,
        componentProps: { documento: item },
        cssClass: 'modal'
      })
      if (success) this.get()
    } catch (error) {
      console.error('Error al abrir el moodal', error)
    }
  }

  union(item: any) {
    const url = environment.apiUrl
    const pdf = item.urlPdf

    if (pdf) {
      const urlpdf = url + pdf;
      window.open(urlpdf, '_blank')
    } else {
      console.warn('No hay URL de PDF disponible')
    }
  }

}
