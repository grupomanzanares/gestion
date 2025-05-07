import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.scss'],
  standalone: false
})
export class RecepcionComponent implements OnInit {
  @Input() documento: any

  compras: any[] = []
  responsables: any[] = []
  selectedFileName: string = '';
  selectedFile: File | null = null;
  responsableFiltrados: any[] = []
  searchResponsable: string = ''

  user = {} as any;

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

  constructor(private master: MasterService,
    private masterTable: MasterTableService,
    private modalCtrl: ModalController,
    private toast: ToastService,
    private storage: StorageService) { }

  ngOnInit() {
    /** Datos del usuario  */
    this.user = this.storage.get('manzanares-user')

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
        this.responsables = data.filter(item => item.rolId === 3)
        this.responsableFiltrados = [...this.responsables]
      }
    })
  }

  getDatos() {
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

    /** Paso 1: Validar Formulario */
    if (this.inputs.invalid) {
      console.warn('Formulario inválido');
      this.toast.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    /***  Paso 2:  Crear FormData  */
    const formData = new FormData();

    /** Paso 3:  Cargar los datos a modificar en el formData */
    const fields = ['tipoCompraId', 'responsableId', 'emisor', 'numero'];
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    });

    formData.append('id', this.documento.id);
    formData.append('userMod', this.user.identificacion);
    formData.append('estadoId', '2');


    /**  Paso 4: Adjuntar el archivo PDF si existe*/
    if (this.selectedFile) {
      formData.append('archivo', this.selectedFile, this.selectedFile.name);
    }

    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (res) => {
        this.toast.presentToast('checkmark-outline', 'Tipo de compra y Responsable añadidos correctamente', 'success', 'top')
        this.modalCtrl.dismiss(true)
        console.log(res)
      },
      error: (err) => {
        console.error('Error al actualizar documento:', err);
      }
    })
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;

    }
  }

  search() {
    const search = this.searchResponsable.toLowerCase()
    this.responsableFiltrados = this.responsables.filter(responsable => responsable.name.toLowerCase().startsWith(search))
  }

  selectResponsable(responsable: any) {
    this.searchResponsable = responsable.name;
    this.inputs.get('responsableId')?.setValue(responsable.id);
    this.responsableFiltrados = [];
  }

}
