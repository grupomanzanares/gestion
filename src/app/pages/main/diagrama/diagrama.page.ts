import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { MasterService } from 'src/app/services/gestion/master.service';

@Component({
  selector: 'app-diagrama',
  templateUrl: './diagrama.page.html',
  styleUrls: ['./diagrama.page.scss'],
  standalone: false
})
export class DiagramaPage implements OnInit {

  documentos: any[] = [];
  tiempos: any = {};
  chartBarras: Chart | null = null;
  chartResponsable: Chart | null = null;
  chartTiemposPromedio: Chart | null = null;
  chartAutContResp: Chart | null = null;

  // <<< NUEVO: estado de fechas (lo llena ion-datetime)
  filterStartDate: string = '';
  filterEndDate: string = '';

  resumen: any[] = [];
  resumenResponsable: { estado: string, cantidad: number }[] = [];
  responsableSeleccionado: string = '';
  diasFactura: { dias: number, fecha: string } | null = null;

  // Configuración de estados
  readonly estadosConfig = [
    { label: 'Recepción', id: 1 },
    { label: 'Autorizadas', id: 2 },
    { label: 'Contabilidad', id: 3 },
    { label: 'Cruzar', id: 4 },
    { label: 'Tesorería', id: 5 },
    { label: 'Caja Menor', id: 6 },
    { label: 'Finalizadas', id: 7 },
    { label: 'Anuladas', id: 8 }
  ];

  readonly tiemposPromedioLabels = [
    'Asignación → Autorización',
    'Autorización → Contabilización',
    'Contabilización → Tesorería'
  ];

  constructor(private master: MasterService) { }

  /**
   * Inicializa fechas por defecto y carga datos iniciales.
   */
  ngOnInit() {
    // <<< NUEVO: fechas por defecto (1er día del mes → hoy)
    this.setDefaultDates();

    this.get();
    // <<< NUEVO: carga inicial de tiempos con el rango por defecto
    this.getTiempos(
      this.toISODate(this.filterStartDate),
      this.toISODate(this.filterEndDate)
    );
  }

  // Utilidad para convertir a número
  private toNum(v: any): number {
    if (v == null) return 0;
    if (typeof v === 'string') {
      const n = parseFloat(v.replace(',', '.').trim());
      return Number.isFinite(n) ? n : 0;
    }
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  // <<< NUEVO: setear fechas por defecto
  private setDefaultDates(): void {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    this.filterStartDate = first.toISOString();
    this.filterEndDate = now.toISOString();
  }

  // <<< NUEVO: normaliza a YYYY-MM-DD sin desfasar por zona horaria
  private toISODate(input: string | Date): string {
    const d = new Date(input);
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  get() {
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        this.documentos = data;
        this.totales();
        this.graficoBarras();
        this.graficoHorizontal();
      }
    });
  }

  // <<< CAMBIO: acepta fechas opcionales y usa las seleccionadas si están
  getTiempos(fechaInicio?: string, fechaFin?: string) {
    const fi = fechaInicio || this.toISODate(this.filterStartDate);
    const ff = fechaFin || this.toISODate(this.filterEndDate);

    this.master.get(`compras_reportadas/mediciones-tiempo?tipo=porUsuario&fechaInicio=${fi}&fechaFin=${ff}`).subscribe({
      next: (data) => {
        this.tiempos = data;
        this.graficoTiemposPromedio(this.tiempos);

        const porResp = this.tiempos?.data?.porResponsable ?? this.tiempos?.porResponsable;
        this.graficoAutContPorResponsable(porResp);
      },
      error: (err) => {
        console.error('Error al obtener los tiempos:', err);
      }
    });
  }

  totales() {
    this.resumen = this.estadosConfig.map(e => ({
      label: e.label,
      valor: this.documentos.filter(item => item.compras_estado?.id === e.id).length
    }));
    this.resumen.unshift({ label: 'Total', valor: this.documentos.length });
  }

  graficoBarras() {
    if (this.chartBarras) this.chartBarras.destroy();

    const colores = ['#226C3B', '#2D8F4E', '#38B261', '#50C878', '#73D393', '#96DEAE', '#B9E9C9', '#ECF87F'];
    const valores = this.resumen.slice(1).map(d => d.valor); // omite 'Total'
    const etiquetas = this.resumen.slice(1).map(d => d.label);

    this.chartBarras = new Chart('barras', {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Cantidad',
          data: valores,
          backgroundColor: colores
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    });
  }

  graficoHorizontal() {
    if (this.chartResponsable) this.chartResponsable.destroy();

    const conteo: { [key: string]: number } = {};
    this.documentos.forEach(doc => {
      const nombre = doc.responsable?.name || 'Recepcion';
      conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    const labels = Object.keys(conteo);
    const data = Object.values(conteo);

    const backgroundColors = labels.map((_, i) => {
      const base = 100 + (i * 30) % 155;
      return `rgba(${base}, ${180 - i * 20}, ${150 + i * 10}, 0.7)`;
    });

    const canvas = document.getElementById('responsable') as HTMLCanvasElement;
    if (canvas) canvas.height = labels.length * 25;

    this.chartResponsable = new Chart('responsable', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cantidad de facturas',
          data: data,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctr) => `${ctr.label}: ${ctr.raw} facturas`
            }
          }
        },
        scales: {
          x: { beginAtZero: true }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const responsable = labels[index];
            this.resumenRespo(responsable);
          }
        }
      }
    });
  }

  resumenRespo(responsable: string) {
    this.responsableSeleccionado = responsable;

    const docsResponsable = this.documentos.filter(doc => {
      const nombre = doc.responsable?.name || '';
      return nombre === responsable;
    });

    const resumenMap: { [estado: string]: number } = {};
    docsResponsable.forEach(doc => {
      const estado = doc.compras_estado?.nombre || '';
      resumenMap[estado] = (resumenMap[estado] || 0) + 1;
    });

    this.resumenResponsable = Object.entries(resumenMap).map(([estado, cantidad]) => ({
      estado,
      cantidad
    }));
    this.diasFactura = this.facturaAntigua(responsable);
  }

  facturaAntigua(responsable: string): { fecha: string, dias: number } | null {
    const docsRespon = this.documentos.filter(doc => {
      const nombre = doc.responsable?.name || '';
      return nombre === responsable && doc.compras_estado?.id === 2 && doc.fechaAsignacion;
    });

    if (docsRespon.length === 0) return null;

    const facturaMasAntigua = docsRespon.reduce((prev, curr) => {
      return new Date(prev.fechaAsignacion) < new Date(curr.fechaAsignacion) ? prev : curr;
    });

    const fechaAntigua = new Date(facturaMasAntigua.fechaAsignacion);

    // ✅ Mostrar fecha legible
    const fecha = fechaAntigua.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // ✅ Comparación sin horas
    const hoy = new Date();
    const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    const fechaAsignacion = new Date(fechaAntigua.getFullYear(), fechaAntigua.getMonth(), fechaAntigua.getDate());

    const diferenciaMs = fechaHoy.getTime() - fechaAsignacion.getTime();
    const diasPasados = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    return { fecha, dias: diasPasados };
  }


  graficoTiemposPromedio(tiempos: any) {
    if (this.chartTiemposPromedio) this.chartTiemposPromedio.destroy();

    const general = tiempos?.data?.general ?? {};
    const data = [
      this.toNum(general.tiempoPromedioAsignacionAutorizacion),
      this.toNum(general.tiempoPromedioAutorizacionContabilizacion),
      this.toNum(general.tiempoPromedioContabilizacionTesoreria)
    ];
    const backgroundColors = ['#4e73df', '#1cc88a', '#36b9cc'];

    const canvas = document.getElementById('barrasTiempos') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartTiemposPromedio = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.tiemposPromedioLabels,
        datasets: [{
          label: 'Tiempo promedio (días)',
          data: data,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} días`
            }
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  getTiemposPromedioArray(): { label: string, valor: number | string }[] {
    const general = this.tiempos?.data?.general ?? {};
    return [
      {
        label: this.tiemposPromedioLabels[0],
        valor: general.tiempoPromedioAsignacionAutorizacion ?? '0'
      },
      {
        label: this.tiemposPromedioLabels[1],
        valor: general.tiempoPromedioAutorizacionContabilizacion ?? '0'
      },
      {
        label: this.tiemposPromedioLabels[2],
        valor: general.tiempoPromedioContabilizacionTesoreria ?? '0'
      }
    ];
  }

  graficoAutContPorResponsable(porResponsable: any) {
    if (this.chartAutContResp) this.chartAutContResp.destroy();

    let arr: any[] = [];
    if (Array.isArray(porResponsable)) {
      arr = porResponsable;
    } else if (porResponsable && typeof porResponsable === 'object') {
      arr = Object.values(porResponsable);
    }

    // <<< FIX: usar tiempoPromedioAutorizacionContabilizacion (no Asignación)
    const dataMapped = arr.map((r: any) => ({
      nombre: r?.nombreResponsable || r?.emailResponsable || `ID ${r?.responsableId ?? ''}`,
      valor: this.toNum(r?.tiempoPromedioAutorizacionContabilizacion),
    })).sort((a, b) => b.valor - a.valor);

    const labels = dataMapped.map(x => x.nombre);
    const data = dataMapped.map(x => x.valor);

    const palette = [
      '#1241A1', '#1454AE', '#1768BB', '#1A7DC9', '#1C94D6', '#22ACE0',
      '#31BFE1', '#40CFE2', '#4EDEE3', '#5DE5DF', '#6BE6D8', '#7AE8D2',
      '#88E9CF', '#96EBCD', '#A4EDCE', '#B1F0D0', '#BFF2D4', '#CDF4DA',
    ];
    const backgroundColors = labels.map((_, i) => palette[i % palette.length]);

    const canvas = document.getElementById('autContResp') as HTMLCanvasElement | null;
    if (canvas) canvas.height = Math.max(240, labels.length * 28);

    this.chartAutContResp = new Chart('autContResp', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Promedio Autorización → Contabilización (días)',
          data,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw} días`
            }
          }
        },
        scales: {
          x: { beginAtZero: true }
        }
      }
    });
  }

  // <<< CAMBIO: al cambiar fecha, guarda y llama a la API
  onDateChange(type: 'form' | 'start' | 'end', value: string | string[]) {
    const selected = Array.isArray(value) ? value[0] : value;
    const selectedDate = selected?.split('T')[0] || '';

    if (type === 'start') this.filterStartDate = selectedDate;
    else this.filterEndDate = selectedDate;

    // si ambas fechas están listas, llama a la API y redibuja
    if (this.filterStartDate && this.filterEndDate) {
      const start = this.toISODate(this.filterStartDate);
      const end = this.toISODate(this.filterEndDate);
      // Corrige si el usuario puso al revés
      const [fi, ff] = start <= end ? [start, end] : [end, start];
      this.getTiempos(fi, ff);
      // Si también quieres filtrar los documentos: this.get(fi, ff);
    }
  }
}
