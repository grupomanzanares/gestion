import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-anulacion',
  templateUrl: './anulacion.component.html',
  styleUrls: ['./anulacion.component.css'],
  standalone: false
})
export class AnulacionComponent implements OnInit {

  @Input() documento: any;


  selectedFileName: string = '';
  selectedFile: File | null = null;


  user = {} as any;
  public inputs = new FormGroup({
    emisor: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    empresa: new FormControl(null, [Validators.required]),
    empresaInfo: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    observacionResponsable: new FormControl(null)
  })


  constructor(private master: MasterService, private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService) { }


  ngOnInit() {
    this.user = this.storage.get('manzanares-user');
    this.getDatos();
  }


  ngOut() {
    this.modalCtrl.dismiss();
  }


  getDatos() {
    console.log(this.documento);
    this.inputs.patchValue({
      emisor: this.documento.emisor,
      nombreEmisor: this.documento.nombreEmisor,
      empresa: this.documento.empresa,
      empresaInfo: this.documento.empresaInfo?.nombre || this.documento.empresa,
      tipo: this.documento.tipo,
      numero: this.documento.numero,
      valor: this.documento.valor ? Number(this.documento.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : '',
    });
  }


  update() {
    if (this.inputs.invalid) {
      this.toast.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }


    const formData = new FormData();


    formData.append('id', this.documento.id);
    formData.append('userMod', this.user.identificacion);
    formData.append('observacionResponsable', this.inputs.value.observacionResponsable);
    formData.append('estadoId', '8');


    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (data) => {
        this.toast.presentToast('checkmark-circle-outline', 'Anulación registrada correctamente.', 'success', 'top');
        this.modalCtrl.dismiss(true);
      },
      error: (error) => {
        console.error('Error al actualizar:', error);
        this.toast.presentToast('alert-circle-outline', 'Error al registrar la anulación.', 'danger', 'top');
      }
    });

  }

}
