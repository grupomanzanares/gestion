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
          numero: (row.Prefijo ?? '') + (row.Folio ?? '') || row["Número"] || '',
          fecha: this.convertirFecha(row["Fecha Emisión"]),
          emisor: row["NIT Receptor"],
          nombreEmisor: row["Nombre Receptor"],
          empresa: row["NIT Emisor"],
          // valor: Number(row[" Total "]) || 0,
          valor: row.Total,
          tipo: row["Tipo de documento"],
          user: user.name,
          userMod: user.name,
        }));
        this.dataFiltrada = this.dataExel.filter(item => item.tipo?.toString().trim().toLowerCase() === "factura electrónica" || item.tipo?.toString().trim().toLowerCase() === "nota de crédito electrónica" || item.tipo?.toString().trim().toLowerCase() === "nota debito electrónica" || item.tipo?.toString().trim().toLowerCase() === "factura electrónica de contingencia DIAN" || item.tipo?.toString().trim().toLowerCase() === "factura electrónica de contingencia" || item.tipo?.toString().trim().toLowerCase() === "documento equivalente post");
        console.log('Filtrados', this.dataFiltrada);
      }
      reader.readAsArrayBuffer(file)
    }
  }
  convertirFecha(fechaStr: string): string {
    if (!fechaStr) return '';

    // Si es número de Excel
    if (!isNaN(Number(fechaStr))) {
      const fechaExcel = XLSX.SSF.parse_date_code(Number(fechaStr));
      const fechaJs = new Date(fechaExcel.y, fechaExcel.m - 1, fechaExcel.d, fechaExcel.H, fechaExcel.M, fechaExcel.S);
      return fechaJs.toISOString().replace('T', ' ').split('.')[0]; // YYYY-MM-DD HH:mm:ss
    }

    // Si viene como string "DD-MM-YYYY"
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = fechaStr.match(regex);
    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day} 00:00:00`;
    }

    // Si viene como "YYYY-MM-DD HH:mm:ss", lo dejamos igual
    return fechaStr;
  }

  uploadFile() {
    if (this.dataFiltrada.length === 0) {
      this.toast.presentToast('alert-outline', 'No hay facturas electrónicas para subir', 'danger', 'top');
      return;
    }

    // Validación: eliminar registros incompletos
    this.dataFiltrada = this.dataFiltrada.filter(item =>
      item.cufe && item.numero && item.fecha && item.emisor && item.empresa && !isNaN(item.valor)
    );

    console.log('Total a subir luego de filtro final:', this.dataFiltrada.length);

    // Detección de CUFEs duplicados
    const cufes = this.dataFiltrada.map(item => item.cufe);
    const duplicados = cufes.filter((cufe, index, self) => self.indexOf(cufe) !== index);
    if (duplicados.length > 0) {
      console.warn('CUFEs duplicados detectados (no serán subidos si el backend los rechaza):', duplicados);
    }

    const chunkSize = 100;
    const totalChunks = Math.ceil(this.dataFiltrada.length / chunkSize);
    let chunksEnviados = 0;

    for (let i = 0; i < this.dataFiltrada.length; i += chunkSize) {
      const chunk = this.dataFiltrada.slice(i, i + chunkSize);

      this.master.createtow('registros_dian', chunk).subscribe({
        next: (res) => {
          chunksEnviados++;
          console.log(`Chunk ${chunksEnviados}/${totalChunks} subido con éxito`);
          console.log('Datos enviados:', chunk);
          console.log('Respuesta del backend:', res);

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
