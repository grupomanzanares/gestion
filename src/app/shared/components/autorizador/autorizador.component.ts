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
  selectedFile: File | null = null;
  centros: any[] = []
  centrosFiltrados: any[] = [];
  searchCentro: string = '';
  documentos: any[] = [];
  centrosPorItem: { [numeroItem: string]: string } = {};
  cantidad = 0
  costoIva = 0
  costoBruto = 0
  total = 0
  buscandoCentro = false;
  user = {} as any;
  public adjuntos: boolean = false
  public asignar: boolean = false

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
    ccostoNombre: new FormControl(null, [Validators.required]),
    observacionContable: new FormControl(null),
    observacionTesoreria: new FormControl(null)
  })

  constructor(private master: MasterService, private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService) { }

  ngOnInit() {
    this.user = this.storage.get('manzanares-user')
    this.getCentro()
    this.getDatos()
    this.getjson()
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  getDatos() {
    if (this.documento) {
      const codigoCentro = this.documento.ccosto;
      const centro = this.centros.find(c => c.codigo === codigoCentro);

      const nombreCentro = centro ? centro.nombre : 'No encontrado';

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
        ccosto: codigoCentro,
        ccostoNombre: nombreCentro,
        observacionContable: this.documento.observacionContable,
        observacionTesoreria: this.documento.observacionTesoreria
      });

      this.searchCentro = `${nombreCentro} - ${codigoCentro}`;
      this.buscandoCentro = false;
      console.log(this.documento)
    }
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

    if (this.selectedFile) {
      formData.append('adjuntos', this.selectedFile, this.selectedFile.name);
    }

    console.log('datos enviados', formData)

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
    this.centrosFiltrados = this.centros.filter(centro => centro.nombre.toLowerCase().includes(search));
  }

  selectCentro(centro: any) {
    this.searchCentro = `${centro.nombre} - ${centro.codigo}`; // mostrar bonito en el input
    this.inputs.get('ccosto')?.setValue(centro.codigo);         // guardar SOLO el codigo en el form
    this.centrosFiltrados = [];                                // limpiar lista filtrada
    this.buscandoCentro = false
  }

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

}
