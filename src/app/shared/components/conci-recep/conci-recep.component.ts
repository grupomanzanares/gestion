import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-conci-recep',
  templateUrl: './conci-recep.component.html',
  styleUrls: ['./conci-recep.component.scss'],
  standalone: false
})
export class ConciRecepComponent  implements OnInit {
  @Input() documento: any

  public inputs = new FormGroup({
    empresa: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    emisor: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    fecha: new FormControl(null, [Validators.required]),
    cufe: new FormControl(null, [Validators.required])
  })

  constructor(private master: MasterService, private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService) { }

  ngOnInit() {
    this.getDatos()
    console.log(this.inputs.value)
  }

  ngOut() {
    this.modalCtrl.dismiss()
  }

  getDatos() {
    if (this.documento) {
      this.inputs.patchValue({
        empresa: this.documento.empresa,
        nombreEmisor: this.documento.nombreEmisor,
        emisor: this.documento.emisor,
        tipo: this.documento.tipo,
        numero: this.documento.numero,
        valor: this.documento.valor,
        fecha: this.documento.fecha,
        cufe: this.documento.cufe
      })
    }
  }

  createRecepcion() {
    const usuario = this.storage.get('manzanares-user');
  
    // Asegúrate de no modificar el original directamente
    const nuevoDocumento = {
      ...this.documento,
      estadoId: 1,
      user: usuario.name,
      userMod: usuario.name
    };
  
    this.master.create('compras_reportadas', nuevoDocumento).subscribe({
      next: (data) => {
        console.log('Documento creado exitosamente:', nuevoDocumento);
        this.toast.presentToast('checkmark-circle','Documento creado correctamente', 'success', 'top');
        this.modalCtrl.dismiss(true);
      },
      error: (error) => {
        console.error('Error al crear la recepción:', error);
        this.toast.presentToast('close-circle' ,'Error al crear el documento', 'danger', 'top');
      }
    });
  }

}
