import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-load-file',
  templateUrl: './load-file.component.html',
  styleUrls: ['./load-file.component.scss'],
  standalone: false
})
export class LoadFileComponent implements OnInit {

  dataExel: any[] = []
  selectedFileName: string = '';

  constructor(private master: MasterService, private toast: ToastService, private storage: StorageService, private modalCtrl: ModalController) { }

  ngOnInit() { }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      const reader = new FileReader()

      reader.onload = async (e: any) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('Datos extraidos', jsonData)

        const user = await this.storage.get('manzanares-user')

        this.dataExel = jsonData.map((row: any) => ({
          emisor: row["Identificacion del Emisor"],
          nombreEmisor: row.Emisor,
          empresa: row["Identificacion del Receptor"],
          tipo: row["Tipo de Documento"],
          numero: row["No Documento"],
          fecha:this.convertirFecha (row["Fecha Estado Comercial"]),
          cufe: row["CUFE/CUDE"],
          valor: row["Valor Total"],
          user: user.name,
          userMod: user.name,
          estadoId: 1,
          tipoCompraId: 1,
        }))
      }
      reader.readAsArrayBuffer(file)
    }
  }

  convertirFecha(fechaStr: string): string {
    if (!fechaStr) return '';
  
    // Verifica si la fecha viene en formato número de Excel
    if (!isNaN(Number(fechaStr))) {
      const fechaExcel = XLSX.SSF.parse_date_code(Number(fechaStr));
      return new Date(fechaExcel.y, fechaExcel.m - 1, fechaExcel.d, fechaExcel.H, fechaExcel.M, fechaExcel.S).toISOString();
    }
  
    // Si viene como texto, intenta formatearla
    const partes = fechaStr.split(" ");
    if (partes.length === 2) {
      const [fecha, hora] = partes;
      const horaLimpia = hora.replace(/:/g, "-"); // Reemplaza ":" en milisegundos
      return `${fecha}T${horaLimpia}`;
    }
  
    return fechaStr; // Si falla, devuelve el valor original
  }
  

  uploadFile() {
    console.log('datos a subir', this.dataExel)
    if (this.dataExel.length === 0) {
      this.toast.presentToast('alert-outline', 'No hay datos para subir', 'danger', 'top')
      return
    }

    this.master.createtow('compras_reportadas', this.dataExel).subscribe({
      next: (res) => {
        console.log('Datos subidos con éxito', res);
        this.toast.presentToast('checkmark-outline', 'Datos subidos correctamente', 'success', 'top')
        this.modalCtrl.dismiss(true)
      },
      error: (error) => {
        console.error('Error al subir archivo', error);
        this.toast.presentToast('alert-circle-outline', 'Error al subir los datos', 'danger', 'top')
      }
    })
  }

  
}
