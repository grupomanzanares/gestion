import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
    productoId: new FormControl(null, [Validators.required])
  })

  constructor(private masterTable: MasterTableService, private modalCtrl: ModalController, private toast: ToastService, private storage: StorageService, private loading: LoadingService) { }

  ngOnInit() {
    this.user = this.storage.get('manzanares-user')
    this.getjson()
    this.getProductos()
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
        valor: this.documento.valor,
        urlpdf: this.documento.urlPdf,
        ccosto: this.documento.ccostoNombre
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
        this.documento = data
        this.documentos = data.jsonContent?.documento?.items || []
        console.log(this.documentos)
        this.getDatos()
      },
      error: (err) => {
        console.error('Error al obtener el documento completo', err);

      }
    })
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

    const fields = ['observacionContable']
    fields.forEach(field => {
      if (this.inputs.get(field)?.value !== null && this.inputs.get(field)?.value !== undefined) {
        formData.append(field, this.inputs.get(field).value);
      }
    })

    formData.append('id', this.documento.id)
    formData.append('userMod', this.user.identificacion);
    formData.append('estadoId', '5');

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

  // search() {
  //   const search = this.searchProducto.toLowerCase()
  //   this.productosFiltrados = this.productos.filter(p => p.nombre.toLowerCase().startsWith(search))
  // }

  // selectProductos(productos: any) {
  //   this.searchProducto = productos.nombre;
  //   this.inputs.get('productoId')?.setValue(productos.id)
  //   this.productosFiltrados = []

  //   console.log('producto seleccionado', productos)
  // }

  search(valor: string, item: any) {
    const search = valor.toLowerCase();
    item.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(search)
    );
  }
  
  selectProductos(producto: any, item: any) {
    item.nombre = producto.nombre;
    item.codigo = producto.codigo; // si tienes este campo en el `item`
    item.productosFiltrados = [];
    console.log('Producto seleccionado en fila:', producto);
  }
}