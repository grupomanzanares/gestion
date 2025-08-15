import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-autorizador',
  templateUrl: './autorizador.component.html',
  styleUrls: ['./autorizador.component.scss'],
  standalone: false
})
export class AutorizadorComponent implements OnInit {
  @Input() documento: any

  selectedFileName: string = '';
  selectedFiles: File[] = [];
  centros: any[] = []
  centrosFiltrados: any[] = [];
  searchCentro: string = '';
  documentos: any[] = [];
  usados: any[] = [];
  centrosPorItem: { [numeroItem: string]: string } = {};
  cantidad = 0
  costoIva = 0
  costoBruto = 0
  total = 0
  buscandoCentro = false;
  user = {} as any;
  public adjuntos: boolean = false
  public asignar: boolean = false

  typeaheadOpen = false;
  highlightedIndex = 0;


  public inputs = new FormGroup({
    emisor: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    empresa: new FormControl(null, [Validators.required]),
    empresaInfo: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    compras_tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    observacionResponsable: new FormControl(null, [Validators.required]),
    urlpdf: new FormControl(null, [Validators.required]),
    ccosto: new FormControl(null, [Validators.required]),
    ccostoNombre: new FormControl(null),
    observacionContable: new FormControl(null),
    observacionTesoreria: new FormControl(null)
  })

  constructor(private master: MasterService, private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService) { }

  ngOnInit() {
    this.user = this.storage.get('manzanares-user')
    this.getCentro()
    this.getDatos()
    this.getjson()
    this.getCcUsados()
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const nuevosArchivos: File[] = Array.from(event.target.files);

      this.selectedFiles = [...this.selectedFiles, ...nuevosArchivos];

      // Elimina duplicados por nombre (opcional)
      const unique = new Map(this.selectedFiles.map(file => [file.name, file]));
      this.selectedFiles = Array.from(unique.values());

      this.selectedFileName = this.selectedFiles.map(f => f.name).join(', ');
    }
  }

  getDatos() {
    if (this.documento) {
      const codigoCentro = this.documento.ccosto;
      const centro = this.centros.find(c => c.codigo === codigoCentro);
      const nombreCentro = centro ? centro.nombre : '';

      this.inputs.patchValue({
        emisor: this.documento.emisor,
        nombreEmisor: this.documento.nombreEmisor,
        empresa: this.documento.empresa,
        empresaInfo: this.documento.empresaInfo?.nombre,
        tipo: this.documento.tipo,
        compras_tipo: this.documento.compras_tipo?.nombre,
        numero: this.documento.numero,
        observacionResponsable: this.documento.observacionResponsable,
        valor: this.documento.valor ? Number(this.documento.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : '',
        urlpdf: this.documento.urlPdf,
        ccosto: codigoCentro || '',
        ccostoNombre: nombreCentro,
        observacionContable: this.documento.observacionContable,
        observacionTesoreria: this.documento.observacionTesoreria
      });

      // Si no hay centro asignado, mostrar solo el placeholder
      if (centro) {
        this.searchCentro = `${nombreCentro} - ${codigoCentro}`;
      } else {
        this.searchCentro = ''; // esto hará que se vea solo el placeholder
      }

      this.buscandoCentro = false;
      console.log(this.documento);
    }
  }

  //Centros mas usados por el responsable
  private toArray<T = any>(resp: any): T[] {
    if (Array.isArray(resp)) return resp;
    if (Array.isArray(resp?.data)) return resp.data;
    if (resp?.data && typeof resp.data === 'object') return Object.values(resp.data);
    return [];
  }

  getCcUsados() {
    const id = this.user.id;
    const nit = this.documento.empresa;

    this.masterTable
      .get(`compras_reportadas/centros-costo-por-responsable?responsableId=${id}&empresa=${nit}`)
      .subscribe({
        next: (resp) => {
          this.usados = this.toArray(resp);          // 👈 aquí el cambio
          console.log('Centros usados por el responsable:', this.usados);
        }
      });
  }

  getjson() {
    this.masterTable.get(`compras_reportadas/${this.documento.id}`).subscribe({
      next: (data) => {
        this.documento = data;
        this.documentos = data.items || [];

        // Asignar centros ya guardados
        this.documentos.forEach(item => {
          const centroAsignado = this.centros.find(c => c.codigo === item.CentroDeCosto);

          if (centroAsignado) {
            item.nombre = centroAsignado.nombre;
            item.codigo = centroAsignado.codigo;
            this.centrosPorItem[item.numeroItem] = centroAsignado.codigo;
          } else if (item.CentroDeCosto) {
            item.nombre = 'Centro no encontrado';
            item.codigo = item.CentroDeCosto;
            this.centrosPorItem[item.numeroItem] = item.CentroDeCosto;
          }
        });

        this.getDatos();
      }
    });
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

  // Verifica si la observación contable tiene contenido
  mostrarObservacionContable(): boolean {
    const valor = this.inputs.controls.observacionContable?.value;
    return valor && valor.trim() !== '';
  }

  // Verifica si la observación tesorería tiene contenido
  mostrarObservacionTesoreria(): boolean {
    const valor = this.inputs.controls.observacionTesoreria?.value;
    return valor && valor.trim() !== '';
  }

  getCentro() {
    const nit = this.documento.empresa;
    this.master.getWo('ccostos', nit).subscribe({
      next: (data) => {
        this.centros = data;
        this.centrosFiltrados = [...this.centros];
      }
    });
  }

  update() {
    if (this.inputs.invalid) {
      console.warn('Formulario inválido');
      Object.keys(this.inputs.controls).forEach(campo => {
        const control = this.inputs.get(campo);
        if (control && control.invalid) {
          console.log(`❌ Campo inválido: ${campo}`, control.errors);
        }
      });
      this.toast.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    const formData = new FormData();

    const fields = ['observacionResponsable', 'ccosto']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })
    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('fechaAutorizacion', new Date().toISOString());
    formData.append('estadoId', '3');

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('adjuntos', file, file.name);
      });

      this.masterTable.update('compras_reportadas/autorizar', formData).subscribe({
        next: (res) => {
          this.toast.presentToast('checkmark-outline', 'Autorizado con éxito', 'success', 'top');
          this.modalCtrl.dismiss(true);
          console.log(res);
        },
        error: (error) => {
          console.error('Error al autorizar:', error);
        }
      });
    } else {
      this.masterTable.update('compras_reportadas', formData).subscribe({
        next: (res) => {
          this.toast.presentToast('checkmark-outline', 'Autorizado con exito', 'success', 'top')
          this.modalCtrl.dismiss(true)
          console.log(res)
        },
        error: (error) => {
          console.error('Error al autorizar:', error)
        }
      })
    }

    // Mostrar el contenido de FormData
    console.log('datos enviados:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

  }

  removeFile(fileName: string) {
    this.selectedFiles = this.selectedFiles.filter(file => file.name !== fileName);
    this.selectedFileName = this.selectedFiles.map(f => f.name).join(', ');
  }

  decline() {
    const formData = new FormData();

    const fields = ['observacionResponsable']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })

    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('estadoId', '1');

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

  searchCentroCosto() {
    this.buscandoCentro = true;
    const search = this.searchCentro.toLowerCase();
    this.centrosFiltrados = this.centros.filter(centro => centro.nombre.toLowerCase().includes(search) || centro.codigo.includes(search));
  }

  // selectCentro(centro: any) {
  //   this.searchCentro = `${centro.nombre} - ${centro.codigo}`; // mostrar bonito en el input
  //   this.inputs.get('ccosto')?.setValue(centro.codigo);         // guardar SOLO el codigo en el form
  //   this.centrosFiltrados = [];                                // limpiar lista filtrada
  //   this.buscandoCentro = false
  // }

  search(valor: string, item: any) {
    // item.centrosFiltrados = this.centros.filter(c => c.nombre.toLowerCase().includes(valor.toLowerCase()) ||
    //   c.codigo.toLowerCase().includes(valor.toLowerCase()))
    const search = valor.toLowerCase();
    item.centrosFiltrados = this.centros.filter(centro => centro.nombre.toLowerCase().includes(search));
  }

  select(centro: any, item: any) {
    item.nombre = centro.nombre;
    item.codigo = centro.codigo
    item.centrosFiltrados = []

    this.centrosPorItem[item.numeroItem] = centro.codigo;
  }

  suma() {
    return {
      cantidad: this.documentos.reduce((acc, item) => acc + Number(item.cantidad || 0), 0),
      costoIVA: this.documentos.reduce((acc, item) => acc + Number(item.costoIva || 0), 0),
      costoBruto: this.documentos.reduce((acc, item) => acc + Number(item.costoBruto || 0), 0),
      total: this.documentos.reduce((acc, item) => acc + Number(item.costoTotal || 0), 0),
    }
  }

  save() {
    // Verificar que todos los ítems tengan centro asignado
    console.log('Documentos', this.documentos)
    const sinCentro = this.documentos.filter(item =>
      !this.centrosPorItem[item.numeroItem]
    );

    // if (sinCentro.length > 0) {
    //   this.toast.presentToast('alert-circle-outline', 'Todos los ítems deben tener un centro de costo asignado.', 'danger', 'top');
    //   return;
    // }

    // Recorre y construye un array con los objetos 
    const itemsFormateados = this.documentos.map(item => ({
      id: item.id,
      compraReportadaId: this.documento.id,
      CentroDeCosto: this.centrosPorItem[item.numeroItem]
    }));

    const payload = {
      // id: this.documento.id,
      documentoId: this.documento.id,
      items: itemsFormateados
    };

    console.log('Datos enviados:', payload);

    this.masterTable.updateTwo('compras_reportadas_detalle/compra', payload).subscribe({
      next: () => {
        this.toast.presentToast('checkmark-outline', 'Centros de costo guardados correctamente', 'success', 'top');
        // this.modalCtrl.dismiss(true);
      },
      error: (err) => {
        console.error('Error al guardar centros de costo:', err);
        this.toast.presentToast('close-circle-outline', 'Error al guardar', 'danger', 'top');
      }
    });
  }

  openTypeahead() {
    this.typeaheadOpen = true;
    // muestra usados si no hay texto; si hay, filtra
    this.onTypeaheadInput();
  }

  closeTypeaheadSoon() {
    // deja tiempo para que el click en la opción ocurra antes de cerrar
    setTimeout(() => this.typeaheadOpen = false, 120);
  }

  onTypeaheadInput() {
    const q = (this.searchCentro || '').trim().toLowerCase();
    if (!q) {
      this.highlightedIndex = 0;
      return; // se mostrarán los "usados"
    }
    this.centrosFiltrados = this.centros.filter(centro =>
      (centro.nombre || '').toLowerCase().includes(q) ||
      String(centro.codigo || '').toLowerCase().includes(q)
    );
    this.highlightedIndex = 0;
  }

  onTypeaheadKey(ev: KeyboardEvent) {
    const list = (this.searchCentro ? this.centrosFiltrados : this.usados) || [];
    const last = Math.max(0, list.length - 1);

    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      if (list.length) this.highlightedIndex = Math.min(this.highlightedIndex + 1, last);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      if (list.length) this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
    } else if (ev.key === 'Enter') {
      ev.preventDefault();
      if (list[this.highlightedIndex]) this.selectCentro(list[this.highlightedIndex]);
    } else if (ev.key === 'Escape') {
      this.typeaheadOpen = false;
    }
  }

  selectCentro(c: any) {
    // muestra bonito en el input
    this.searchCentro = `${c.nombre} - ${c.codigo}`;

    // guarda en tu FormGroup (lo que se envía en update())
    this.inputs.get('ccosto')?.setValue(c.codigo);
    this.inputs.get('ccostoNombre')?.setValue(c.nombre);
    this.inputs.get('ccosto')?.markAsDirty();
    this.inputs.get('ccosto')?.updateValueAndValidity();

    // cierra panel y limpia filtro
    this.typeaheadOpen = false;
    this.centrosFiltrados = [];
  }
}
