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

  documentos: any[] = []
  chart: any;
  recepcion: number = 0
  autorizados: number = 0
  contabilizados: number = 0
  cruzar: number = 0
  tesoreria: number = 0
  caja: number = 0
  fin: number = 0
  total: number = 0
  resumen: any[] = []
  resumenResponsable: { estado: string, cantidad: number }[] = [];
  responsableSeleccionado: string = '';
  diasFactura: { dias: number, fecha: string } | null = null;

  constructor(private master: MasterService) { }

  ngOnInit() {
    this.get()
  }
  
  get() {
    this.master.get('compras_reportadas').subscribe({
      next: (data) => {
        this.documentos = data
        console.log(this.documentos)
        this.totales()
        this.graficoBarras()
        this.grficoHorizontal()
      }
    })
  }

  totales() {
    const recepcion = this.documentos.filter(item => item.compras_estado?.id === 1).length
    const autorizacion = this.documentos.filter(item => item.compras_estado?.id === 2).length
    const contabilidad = this.documentos.filter(item => item.compras_estado?.id === 3).length
    const cruzados = this.documentos.filter(item => item.compras_estado?.id === 4).length
    const tesoreria = this.documentos.filter(item => item.compras_estado?.id === 5).length
    const caja = this.documentos.filter(item => item.compras_estado?.id === 6).length
    const finalizado = this.documentos.filter(item => item.compras_estado?.id === 7).length
    const total = this.documentos.length
    this.recepcion = recepcion
    this.autorizados = autorizacion
    this.contabilizados = contabilidad
    this.cruzar = cruzados
    this.tesoreria = tesoreria
    this.caja = caja
    this.fin = finalizado
    this.total = total

    this.resumen = [
      { label: 'Total', valor: this.total },
      { label: 'Recepción', valor: this.recepcion },
      { label: 'Autorizadas', valor: this.autorizados },
      { label: 'Contabilidad', valor: this.contabilizados },
      { label: 'Cruzar', valor: this.cruzar },
      { label: 'Tesorería', valor: this.tesoreria },
      { label: 'Caja Menor', valor: this.caja },
      { label: 'Finalizadas', valor: this.fin }
    ];

  }

  graficoBarras() {
    const estados = [
      { label: 'Recepción', id: 1 },
      { label: 'Autorizador', id: 2 },
      { label: 'Contabilidad', id: 3 },
      { label: 'Cruzado', id: 4 },
      { label: 'Tesorería', id: 5 },
      { label: 'Caja Menor', id: 6 },
      { label: 'Finalizado', id: 7 }
    ];

    const colores = ['#226C3B', '#2D8F4E', '#38B261', '#50C878', '#73D393', '#96DEAE', '#B9E9C9'];

    const filtro = estados.map(e => ({
      label: e.label,
      value: this.documentos.filter(item => item.compras_estado?.id === e.id).length
    }))

    const ordenar = [...filtro].sort((a, b) => b.value - a.value)
    const asignar: string[] = []

    ordenar.forEach((item, index) => {
      const original = filtro.findIndex(d => d.label === item.label)
      asignar[original] = colores[index]
    })

    const valores = filtro.map(d => d.value)
    const etiquetas = filtro.map(d => d.label)

    this.chart = new Chart('barras', {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Cantidad',
          data: valores,
          backgroundColor: asignar
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  grficoHorizontal() {
    const conteo: { [key: string]: number } = {}

    this.documentos.forEach(doc => {
      const nombre = doc.responsable?.name || 'Recepcion'
      conteo[nombre] = (conteo[nombre] || 0) + 1
    })

    const labels = Object.keys(conteo);
    const data = Object.values(conteo);

    const backgroundColors = labels.map((_, i) => {
      const base = 100 + (i * 30) % 155;
      return `rgba(${base}, ${180 - i * 20}, ${150 + i * 10}, 0.7)`;
    });

    const canvas = document.getElementById('responsable') as HTMLCanvasElement
    if (canvas) {
      canvas.height = labels.length * 25
    }

    this.chart = new Chart('responsable', {
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
          x: {
            beginAtZero: true
          }
        },
        onClick: (evt, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index
            const responsable = labels[index]
            this.resumenRespo(responsable)
          }
        }
      }
    })
  }

  resumenRespo(responsable: string) {
    this.responsableSeleccionado = responsable

    const docsResponsable = this.documentos.filter(doc => {
      const nombre = doc.responsable?.name || ''
      return nombre === responsable
    })

    const resumenMap: { [estado: string]: number} = {}

    docsResponsable.forEach(doc => {
      const estado = doc.compras_estado?.nombre || ''
      resumenMap[estado] = (resumenMap[estado] || 0) + 1
    })

    this.resumenResponsable = Object.entries(resumenMap).map(([estado, cantidad]) => ({
      estado,
      cantidad
    }))
    this.diasFactura = this.facturaAntigua(responsable);
  }

  facturaAntigua(responsable: string): { fecha: string, dias: number } | null {
    const docsRespon = this.documentos.filter(doc => {
      const nombre = doc.responsable?.name || ''
      return nombre === responsable && doc.compras_estado?.id === 2 && doc.fechaAsignacion
    })

    if ( docsRespon.length === 0) return null;

    const facturaMasAntigua = docsRespon.reduce((prev, curr) => {
      return new Date(prev.fechaAsignacion) < new Date(curr.fechaAsignacion) ? prev : curr
    })

    const fechaAntigua = new Date(facturaMasAntigua.fechaAsignacion);
    const hoy = new Date();

    const diferenciaMs = hoy.getTime() - fechaAntigua.getTime();
    const diasPasados = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

    const fecha = fechaAntigua.toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

    return {
      fecha: fecha,
      dias: diasPasados
    };
  }

}
