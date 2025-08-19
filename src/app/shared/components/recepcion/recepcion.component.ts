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
  frecuentes: any[] = []

  typeaheadOpen = false;
  highlightedIndex = 0;

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
    responsableId: new FormControl(null, [Validators.required]),
    observacionResponsable: new FormControl(null),
    observacionContable: new FormControl(null),
    observacionTesoreria: new FormControl(null)
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
    this.getFrecuentes()
  }

  ngOut() {
    this.modalCtrl.dismiss()
  }

  getTpCompra() {
    this.master.get("compras_tipos").subscribe({
      next: (data) => {
        this.compras = data
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

  private toArray<T = any>(resp: any): T[] {
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp?.data)) return resp.data;
    if (resp?.data && typeof resp.data === 'object') return Object.values(resp.data);
    return [];
  }

  getFrecuentes() {
    const emisor = this.documento.emisor
    const empresa = this.documento.empresa
    this.masterTable.get(`compras_reportadas/responsables-por-emisor?empresa=${empresa}&emisor=${emisor}`).subscribe({
      next: (data) => {
        this.frecuentes = this.toArray(data);
        console.log(data)
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
        valor: this.documento.valor ? Number(this.documento.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : '',
        tipoCompraId: this.documento.tipoCompraId,
        responsableId: this.documento.responsableId,
        observacionResponsable: this.documento.observacionResponsable,
        observacionContable: this.documento.observacionContable,
        observacionTesoreria: this.documento.observacionTesoreria
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
    formData.append('fechaAsignacion', new Date().toISOString());

    const tipoCompraId = this.inputs.get('tipoCompraId')?.value;
    if (tipoCompraId === 1) {
      formData.append('estadoId', '2');
    } else {
      formData.append('estadoId', '6');
    }


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
    this.responsableFiltrados = this.responsables.filter(responsable => responsable.name.toLowerCase().includes(search))
  }

  mostrarObservacionContable(): boolean {
    const valor = this.inputs.controls.observacionContable?.value;
    return valor && valor.trim() !== '';
  }

  // Verifica si la observación tesorería tiene contenido
  mostrarObservacionTesoreria(): boolean {
    const valor = this.inputs.controls.observacionTesoreria?.value;
    return valor && valor.trim() !== '';
  }

  mostrarObservacionResponsable(): boolean {
    const valor = this.inputs.controls.observacionResponsable?.value;
    return valor && valor.trim() !== '';
  }

  selectResponsable(responsable: any) {
    this.searchResponsable = responsable.name;
    this.inputs.get('responsableId')?.setValue(responsable.id);
    this.inputs.get('responsableId')?.markAsDirty();
    this.inputs.get('responsableId')?.updateValueAndValidity();
    this.typeaheadOpen = false;
    this.responsableFiltrados = [];
  }

  dian() {
    const url = 'https://catalogo-vpfe.dian.gov.co/User/SearchDocument?DocumentKey='
    const cufe = this.documento.cufe
    const link = url + cufe
    window.open(link, '_blank')
  }

  openTypeahead() {
    this.typeaheadOpen = true;
    this.onTypeaheadInput();
  }

  closeTypeaheadSoon() {
    setTimeout(() => this.typeaheadOpen = false, 120);
  }

  onTypeaheadInput() {
    const q = (this.searchResponsable || '').trim().toLowerCase();
    if (!q) {
      this.highlightedIndex = 0;
      return
    }
    this.responsableFiltrados = this.responsables.filter(responsable =>
      (responsable.name || '').toLowerCase().includes(q) ||
      String(responsable.identificacion || '').toLowerCase().includes(q)
    )
    this.highlightedIndex = 0;
  }

  onTypeaheadKey(ev: KeyboardEvent) {
    const list = (this.searchResponsable ? this.responsableFiltrados : this.frecuentes);
    const last = Math.max(0, list.length - 1);

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (list.length) this.highlightedIndex = Math.min(this.highlightedIndex + 1, last);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (list.length) this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
    } else if (ev.key === 'Enter') {
      ev.preventDefault()
      if (list[this.highlightedIndex]) this.selectResponsable(list[this.highlightedIndex]);
    } else if (ev.key === 'Escape') {
      this.typeaheadOpen = false;
    }
  }

}
