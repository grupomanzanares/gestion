import { Component, OnInit } from '@angular/core';
import { MasterService } from 'src/app/services/gestion/master.service';
import { ModalService } from 'src/app/services/modal.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment.prod';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-trazabilidad',
  templateUrl: './trazabilidad.page.html',
  styleUrls: ['./trazabilidad.page.scss'],
  standalone: false
})
export class TrazabilidadPage implements OnInit {

  public showForm: boolean;
  public showFilters: boolean = false
  documentos: any[] = []
  centros: any[] = []
  responsables: any[] = []
  tpcompras: any[] = []
  estados: any[] = []
  documentosOriginales: any[] = [];
  empresas: any[] = []

  // Filtros
  filterStartDate: string = '';
  filterEndDate: string = '';
  // filterCentroCosto: string = '';
  filterResponsable: string = '';
  filterTipoCompra: string = '';
  filterEstado: string = '';
  filterEmpresa: string = ''


  constructor(private master: MasterService, private modalService: ModalService, private toast: ToastService, private loading: LoadingService) { }

  ngOnInit() {
    this.resetFilters()
    this.get()
    this.getCentro()
    this.getCompras()
    this.getResponsables()
    this.getEstado()
    this.getEmpresa()

    const today = new Date().toISOString().slice(0, 10);
    // this.documentos.fecha.setValue(today)
    this.filterStartDate = today;
    this.filterEndDate = today;
  }

  onShowForm() {
    this.showForm = true;
    this.showFilters = false;
  }

  onCloseForm() {
    this.showForm = false;
    this.showFilters = false;
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
    // this.resetFilters() 
  }

  get() {
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        this.documentosOriginales = data;
        this.documentos = [...data];
      }
    });
  }

  getCentro() {
    this.master.get('ccostos').subscribe({
      next: (data) => {
        this.centros = data
      }
    })
  }

  getResponsables() {
    this.master.get('users').subscribe({
      next: (data) => {
        this.responsables = data.filter(item => item.rolId === 3)
      }
    })
  }

  getCompras() {
    this.master.get('compras_tipos').subscribe({
      next: (data) => {
        this.tpcompras = data
      }
    })
  }

  getEstado() {
    this.master.get('compras_estados').subscribe({
      next: (data) => {
        this.estados = data
      }
    })
  }

  getEmpresa() {
    this.master.get('empresas').subscribe({
      next: (data) => {
        this.empresas = data
      }
    })
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

  parseFecha(fechaStr: string): Date {
    if (!fechaStr) return new Date(''); // fecha inválida
    const parts = fechaStr.split('/');

    if (parts.length === 3) {
      const isMonthFirst = parseInt(parts[0]) <= 12;
      const day = isMonthFirst ? parseInt(parts[1]) : parseInt(parts[0]);
      const month = isMonthFirst ? parseInt(parts[0]) - 1 : parseInt(parts[1]) - 1;
      const year = parseInt(parts[2].length === 2 ? '20' + parts[2] : parts[2]);
      return new Date(year, month, day);
    }

    // fallback si no es reconocible
    return new Date(fechaStr);
  }

  applyFilters() {
    const start = this.filterStartDate ? new Date(this.filterStartDate) : null;
    const end = this.filterEndDate ? new Date(this.filterEndDate) : null;
    if (start && end && start > end) {
      this.toast.presentToast('calendar-outline', 'La fecha de inicio no puede ser mayor que la de fin', 'danger', 'top');
      return;
    }
    if (end) end.setHours(23, 59, 59, 999);

    this.documentos = this.documentosOriginales.filter((doc) => {
      const fechaDoc = this.parseFecha(doc.fecha);

      const matchFecha = (!start && !end) || (start && end && fechaDoc >= start && fechaDoc <= end);
      const matchCentro = !this.filterEmpresa || doc.empresaInfo?.nombre?.toLowerCase().trim() === this.filterEmpresa.toLowerCase().trim();
      const matchResponsable = !this.filterResponsable || doc.responsable?.name?.toLowerCase().trim() === this.filterResponsable.toLowerCase().trim();
      const matchTipoCompra = !this.filterTipoCompra || doc.compras_tipo?.nombre?.toLowerCase().trim() === this.filterTipoCompra.toLowerCase().trim();
      const matchEstado = !this.filterEstado || doc.compras_estado?.nombre?.toLowerCase().trim() === this.filterEstado.toLowerCase().trim();

      return matchFecha && matchCentro && matchResponsable && matchTipoCompra && matchEstado;
    });

    console.log('🔍 Filtros aplicados:', {
      fechaInicio: this.filterStartDate,
      fechaFin: this.filterEndDate,
      centro: this.filterEmpresa,
      responsable: this.filterResponsable,
      tipoCompra: this.filterTipoCompra,
      estado: this.filterEstado,
    });

    console.log('Documentos filtrados:', this.documentos);
  }


  resetFilters() {
    const today = new Date().toISOString().slice(0, 10);
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.filterEmpresa = '';
    this.filterResponsable = '';
    this.filterTipoCompra = '';
    this.filterEstado = '';
    this.get();
  }

  onDateChange(type: 'start' | 'end', value: string | string[]) {
    const selected = Array.isArray(value) ? value[0] : value;
    const selectedDate = selected?.split('T')[0] || '';

    if (type === 'start') {
      this.filterStartDate = selectedDate;
    } else {
      this.filterEndDate = selectedDate;
    }
  }

  exportToExcel() {
    if (this.documentos.length === 0) {
      this.toast.presentToast('alert-circle-outline', 'No hay datos para exportar', 'warning', 'top');
      return;
    }

    const exportData = this.documentos.map(item => ({
      Emisor: item.emisor,
      NombreEmisor: item.nombreEmisor,
      Empresa: item.empresaInfo?.nombre || '',
      TipoDocumento: item.tipo,
      Numero: item.numero,
      TipoCompra: item.compras_tipo?.nombre || '',
      Valor: item.valor,
      Fecha: item.fecha,
      CUFE_CUDE: item.cufe,
      CentroCosto: item.ccostoNombre || '',
      ObservacionResponsable: item.observacionResponsable,
      ObservacionContable: item.observacionContable,
      Estado: item.compras_estado?.nombre || '',
      Conciliado: item.conciliado,
      Responsable: item.responsable?.name || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = this.calculateColumnWidths(exportData);
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Trazabilidad');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'trazabilidad.xlsx');
  }

  private calculateColumnWidths(data: any[]): { wpx: number }[] {
    const keys = Object.keys(data[0]);
    return keys.map((key) => {
      const maxLength = Math.max(
        key.length,
        ...data.map((item) => (item[key] ? item[key].toString().length : 0))
      );
      return { wpx: maxLength * 7 };
    });
  }

}
