import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss'],
  standalone: false
})
export class RecepcionComponent  implements OnInit {
  @Input() documento: any

  compras: any [] = []
  responsables: any [] = []

  public inputs = new FormGroup({
    emisor: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    empresa: new FormControl(null, [Validators.required]),
    empresaInfo: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    tipoCompraId: new FormControl(null, [Validators.required]),
    responsableId: new FormControl(null, [Validators.required])
  })

  constructor(private master: MasterService, private modalCtrl: ModalController, private toast: ToastService) { }

  ngOnInit() {
    this.getTpCompra()
    this.getResponsables()
    this.getDatos()
  }

  ngOut() {
    this.modalCtrl.dismiss()
  }

  getTpCompra() {
    this.master.get("compras_tipos").subscribe({
      next: (data) => {
        this.compras = data
        console.log(data)
      }
    })
  }

  getResponsables() {
    this.master.get("users").subscribe({
      next: (data) => {
        this.responsables = data
      }
    })
  }

  getDatos(){
    if (this.documento) {
      this.inputs.patchValue({
        emisor: this.documento.emisor,
        nombreEmisor: this.documento.nombreEmisor,
        empresa: this.documento.empresa,
        empresaInfo: this.documento.empresaInfo?.nombre || this.documento.empresa,
        tipo: this.documento.tipo,
        numero: this.documento.numero,
        valor: this.documento.valor,
        tipoCompraId: this.documento.tipoCompraId,
        responsableId: this.documento.responsableId 
      });
    }
  }

  update() {
    if (this.inputs.invalid) {
      console.warn('Formulario inválido');
      return;
    }
    const id = this.documento.id
    const datos = {
      ...this.inputs.value,
      estadoId: 2
    };

    this.master.update(datos, 'compras_reportadas', id).subscribe({
      next: (res) => {
        this.toast.presentToast('checkmark-outline', 'Tipo de compra y Responsable añadidos correctamente', 'success', 'top')
        this.modalCtrl.dismiss(true)
      },
      error: (err) => {
        console.error('Error al actualizar documento:', err);
      }
    })
  }

}
