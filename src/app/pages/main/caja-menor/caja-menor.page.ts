import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-caja-menor',
  templateUrl: './caja-menor.page.html',
  styleUrls: ['./caja-menor.page.css'],
  standalone: false,
})
export class CajaMenorPage implements OnInit {
  documentos: any[] = [];
  user = {} as any;

  constructor(private master: MasterService, private masterTable: MasterTableService, private storage: StorageService, private toast: ToastService) {}

  ngOnInit() {
    this.get();
    this.user = this.storage.get('manzanares-user');

  }

  get() {
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        const filtrados = data.filter(
          (item: any) =>
            item.compras_estado?.id === 6 && item.tipoCompraId === 2
        );
        const ordenados = filtrados.sort((a, b) => b.id - a.id);
        this.documentos = ordenados;
        console.log(this.documentos);
      },
    });
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

  update(item: any) {
    const formData = new FormData()

    formData.append('id', item.id)
    formData.append('userMod', this.user.identificacion)
    formData.append('estadoId', '1')

    const payload = {
      compraReportadaId: item.id,
      user: this.user.identificacion,
      evento: 'Devolución a recepción',
      observacion: `Enviado a recepción por ${this.user.name}`,
    };

    this.masterTable.update('compras_reportadas', formData).pipe(
      concatMap(() =>this.masterTable.createTow('compras_reportadas_auditoria', payload))
    ).subscribe({
      next: (res) => {
        this.toast.presentToast('checkmark-outline', 'Devuelto a recepción con éxito', 'success', 'top')
        this.get()
        console.log(res)
      },
      error: (err) => {
        console.error('Error al actualizar el documento:', err);
      }
    })
  }
}
