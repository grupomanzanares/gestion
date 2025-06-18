import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalService } from 'src/app/services/modal.service';
import { ContabilidadComponent } from 'src/app/shared/components/contabilidad/contabilidad.component';
import { LoadFileComponent } from 'src/app/shared/components/load-file/load-file.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-contabilizar',
  templateUrl: './contabilizar.page.html',
  styleUrls: ['./contabilizar.page.scss'],
  standalone: false
})
export class ContabilizarPage implements OnInit {

  documentos: any[] = []

  constructor(private master: MasterService, private modalService: ModalService, private loading: LoadingService) { }

  ngOnInit() {
    this.get()
  }

  get() {
    // this.loading.showLoading()
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        this.documentos = data.filter((item: any) => item.compras_estado?.id === 3)
        console.log(this.documentos)
        // this.loading.hideLoading()
      }
    })
  }

  async modalAutorizador(item: any) {
    try {
      // this.json(item)
      let success = await this.modalService.openModal({
        component: ContabilidadComponent,
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
    // console.log(item)
    

    if (pdf) {
      const urlpdf = url + pdf;
      window.open(urlpdf, '_blank'); // Abre el PDF en nueva pestaña
    } else {
      console.warn('No hay URL de PDF disponible');
    }
  }

  // json(item: any) {
  //   const id = item.id;
  //   console.log('ID del documento:', id);
  
  //   this.master.get(`compras_reportadas/${id}`).subscribe({
  //     next: (res) => {
  //       console.log('Datos completos del documento:', res);
  //     },
  //     error: (err) => {
  //       console.error('Error al obtener el documento:', err);
  //     }
  //   });
  // } 
}