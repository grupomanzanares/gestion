import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-tesoreria',
  templateUrl: './tesoreria.component.html',
  styleUrls: ['./tesoreria.component.scss'],
  standalone: false
})
export class TesoreriaComponent implements OnInit {

  @Input() documento: any

  user = {} as any

  public inputs = new FormGroup({
    emisor: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    empresa: new FormControl(null, [Validators.required]),
    empresaInfo: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    observacionTesoreria: new FormControl(null, [Validators.required]),
    urlpdf: new FormControl(null, [Validators.required]),
    ccosto: new FormControl(null, [Validators.required])
  })

  constructor(private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService) { }

  ngOnInit() {
    this.user = this.storage.get('manzanares-user')
    this.getDatos()
  }

  getDatos() {
    console.log(this.documento)
    if (this.documento) {
      this.inputs.patchValue({
        emisor: this.documento.emisor,
        nombreEmisor: this.documento.nombreEmisor,
        empresa: this.documento.empresa,
        empresaInfo: this.documento.empresaInfo?.nombre || this.documento.empresa,
        tipo: this.documento.tipo,
        numero: this.documento.numero,
        valor: this.documento.valor,
        urlpdf: this.documento.urlPdf,
        ccosto: this.documento.ccostoNombre
      });
    }
  }

  ngOut() {
    this.modalCtrl.dismiss()
  }

  unionDesdeFormulario() {
    const pdf = this.inputs.controls.urlpdf.value;
    const item = { urlPdf: pdf };
    this.union(item);
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

  update() {
    if (this.inputs.invalid) {
      console.warn('Formulario inválido');
      this.toast.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    const formData = new FormData();

    const fields = ['observacionTesoreria']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })

    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('tesoreria', 'true');

    console.log('datos enviados', formData)

    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (res) => {
        this.toast.presentToast('checkmark-outline', 'Aceptado en tesoreria con exito', 'success', 'top')
        this.modalCtrl.dismiss(true)
        console.log(res)
      },
      error: (error) => {
        console.error('Error al autorizar:', error)
      }
    })
  }

  decline() {
    const formData = new FormData();

    const fields = ['observacionContable']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })

    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('estadoId', '4');

    console.log('datos enviados', formData)

    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (res) => {
        this.toast.presentToast('close-circle-outline', 'Rechazado con éxito', 'warning', 'top');
        this.modalCtrl.dismiss(true);
        console.log('Rechazo exitoso:', res);
      },
      error: (error) => {
        console.error('Error al rechazar:', error);
      }
    });
  }

}
