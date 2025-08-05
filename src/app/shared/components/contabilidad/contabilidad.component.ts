import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { MasterTableService } from 'src/app/services/gestion/masterTable.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss'],
  standalone: false
})
export class ContabilidadComponent implements OnInit {

  @Input() documento: any
  documentos: any[] = []
  productos: any[] = []
  searchProducto: string = ''
  productosFiltrados: any[] = []
  centros: any[] = []
  cantidad = 0
  costoIva = 0
  costoBruto = 0
  total = 0

  prod: any[] = []


  user = {} as any

  public inputs = new FormGroup({
    emisor: new FormControl(null, [Validators.required]),
    nombreEmisor: new FormControl(null, [Validators.required]),
    empresa: new FormControl(null, [Validators.required]),
    empresaInfo: new FormControl(null, [Validators.required]),
    tipo: new FormControl(null, [Validators.required]),
    numero: new FormControl(null, [Validators.required]),
    valor: new FormControl(null, [Validators.required]),
    observacionContable: new FormControl(null, [Validators.required]),
    urlpdf: new FormControl(null, [Validators.required]),
    ccosto: new FormControl(null, [Validators.required]),
    productoId: new FormControl(null),
    urladj: new FormControl(null)
  })

  constructor(private master: MasterService, private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService, private loading: LoadingService) { }

  ngOnInit() {
    this.user = this.storage.get('manzanares-user')
    this.getjson()
    this.getProductos()
    this.getCcosto()
  }

  getDatos() {
    console.log(this.documento)
    // this.loading.showLoading()
    if (this.documento) {
      this.inputs.patchValue({
        emisor: this.documento.emisor,
        nombreEmisor: this.documento.nombreEmisor,
        empresa: this.documento.empresa,
        empresaInfo: this.documento.empresaInfo?.nombre || this.documento.empresa,
        tipo: this.documento.tipo,
        numero: this.documento.numero,
        observacionContable: this.documento.observacionContable,
        valor: this.documento.valor ? Number(this.documento.valor).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }) : '',
        urlpdf: this.documento.urlPdf,
        ccosto: this.documento.ccostoNombre,
        urladj: this.documento.adjuntos?.length ? this.documento.adjuntos[0].url : null
      });
    }
    // this.loading.hideLoading()
  }

  getProductos() {
    this.masterTable.get(`productos/por-nit/${this.documento.empresa}`).subscribe({
      next: (data) => {
        this.productos = data
      }
    })
  }

  getjson() {
    this.masterTable.get(`compras_reportadas/${this.documento.id}`).subscribe({
      next: (data) => {
        this.documentos = data.items || []
        console.log(this.documentos)
        this.getDatos()
        this.suma()
      },
      error: (err) => {
        console.error('Error al obtener el documento completo', err);

      }
    })
  }

  getCcosto() {
    const nit = this.documento.empresa;
    this.master.getWo(`ccostos`, nit).subscribe({
      next: (data) => {
        this.centros = data
      }
    })
  }

  getNombreCentro(codigo: string): string {
    const centro = this.centros.find(c => c.codigo === codigo);
    return centro ? centro.nombre : '';
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

  abrirAdjunto(url: string) {
    const fullUrl = environment.apiUrl + url;
    window.open(fullUrl, '_blank');
  }

  update() {
    if (this.inputs.invalid) {
      const controls = this.inputs.controls;
      const camposInvalidos: string[] = [];

      for (const nombre in controls) {
        if (controls[nombre].invalid) {
          camposInvalidos.push(nombre);
          console.log(`Campo inválido: ${nombre}`, controls[nombre].errors);
        }
      }
      this.toast.presentToast('alert-circle-outline', 'Por favor completa todos los campos correctamente.', 'danger', 'top');
      return;
    }

    const formData = new FormData();

    const fields = ['observacionContable']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })

    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('estadoId', '5');
    formData.append('fechaContabilizacion', new Date().toISOString());

    console.log('datos enviados', formData)

    this.masterTable.update('compras_reportadas', formData).subscribe({
      next: (res) => {
        this.toast.presentToast('checkmark-outline', 'Enviado a tesoreria con exito', 'success', 'top')
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
    formData.append('estadoId', '2');

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

  cruzado() {
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
        this.toast.presentToast('repeat-outline', 'Cruzado con éxito', 'success', 'top');
        this.modalCtrl.dismiss(true);
        console.log('Rechazo exitoso:', res);
      },
      error: (error) => {
        console.error('Error al rechazar:', error);
      }
    });
  }

  search(valor: string, item: any) {
    const search = valor.toLowerCase();
    item.productosFiltrados = this.productos.filter(p => p.nombre.toLowerCase().includes(search));
  }

  selectProductos(producto: any, item: any) {
    item.nombre = producto.nombre;
    item.codigo = producto.codigo; // si tienes este campo en el `item`
    item.productosFiltrados = [];
    console.log('Producto seleccionado en fila:', producto);
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
    const sinProducto = this.documentos.filter(item =>
      !item.productoId
    );

    // if (sinProducto.length > 0) {
    //   this.toast.presentToast('alert-circle-outline', 'Todos los ítems deben tener un producto asignado.', 'danger', 'top');
    //   return;
    // }

    const itemsFormateados = this.documentos.map(item => ({
      id: item.id, // id del item
      compraReportadaId: this.documento.id,


      productoId: item.productoId
    }));

    const payload = {
      documentoId: this.documento.id,
      items: itemsFormateados
    };

    this.masterTable.updateTwo('compras_reportadas_detalle/compra', payload).subscribe({
      next: () => {
        this.toast.presentToast('checkmark-outline', 'Productos guardados correctamente', 'success', 'top');
      },
      error: (err) => {
        console.error('Error al guardar productos:', err);
        this.toast.presentToast('close-circle-outline', 'Error al guardar', 'danger', 'top');
      }
    });
  }

}