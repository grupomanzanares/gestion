import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MasterService } from 'src/app/services/gestion/master.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastService } from 'src/app/services/toast.service';
import * as XLSX from 'xlsx';
import { LoadFileComponent } from '../load-file/load-file.component';


@Component({
  selector: 'app-conciliacion',
  templateUrl: './conciliacion.component.html',
  styleUrls: ['./conciliacion.component.scss'],
  standalone: false
})
export class ConciliacionComponent implements OnInit {

  dataExel: any[] = []
  dataFiltrada: any[] = []
  selectedFileName: string = '';

  constructor(private master: MasterService, private toast: ToastService, private storage: StorageService, private modalCtrl: ModalController, private modal: ModalController) { }

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
        console.log('Primera fila (debug):', jsonData[0]);

        const user = await this.storage.get('manzanares-user')

        this.dataExel = jsonData.map((row: any) => ({
          cufe: row["CUFE/CUDE"],
          numero: row.Prefijo + row.Folio,
          fecha: this.convertirFecha(row["Fecha Emisión"]),
          emisor: row["NIT Emisor"],
          nombreEmisor: row["Nombre Emisor"],
          empresa: row["NIT Receptor"],
          nombreEmpresa: row["Nombre Receptor"],
          valor: Number(row[" Total "]) || 0,
          tipo: row["Tipo de documento"],
          user: user.name,
          userMod: user.name,
        }));
        this.dataFiltrada = this.dataExel.filter(item => item.tipo?.toString().trim().toLowerCase() === "factura electrónica" || item.tipo?.toString().trim().toLowerCase() === 'nota de crédito electrónica');
        console.log('Filtrados (factura electrónica):', this.dataFiltrada);
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
    if (this.dataFiltrada.length === 0) {
      this.toast.presentToast('alert-outline', 'No hay facturas electrónicas para subir', 'danger', 'top');
      return;
    }
  
    const chunkSize = 100;
    const totalChunks = Math.ceil(this.dataFiltrada.length / chunkSize);
    let chunksEnviados = 0;
  
    for (let i = 0; i < this.dataFiltrada.length; i += chunkSize) {
      const chunk = this.dataFiltrada.slice(i, i + chunkSize);
  
      this.master.createtow('registros_dian', chunk).subscribe({
        next: () => {
          chunksEnviados++;
          console.log(`Chunk ${chunksEnviados}/${totalChunks} subido con éxito`);
  
          if (chunksEnviados === totalChunks) {
            this.toast.presentToast('checkmark-outline', 'Todos los datos se subieron correctamente', 'success', 'top');
            this.modalCtrl.dismiss(true);
          }
        },
        error: (error) => {
          console.error(`Error al subir el chunk ${i / chunkSize + 1}:`, error);
          this.toast.presentToast('alert-circle-outline', `Error al subir parte del archivo`, 'danger', 'top');
        }
      });
    }
  }  
}
