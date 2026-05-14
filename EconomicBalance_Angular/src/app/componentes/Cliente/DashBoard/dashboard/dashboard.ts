import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HeaderAutenticado } from '../../../Portal/HeaderAutenticado/HeaderAutenticado';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData
} from 'chart.js';
import { firstValueFrom } from 'rxjs';
import { MetasAhorroService } from '../../../../servicios/metas-ahorro.service';
import { TemplatesService } from '../../../../services/templates-service';
import { MetaAhorro, ResumenMensualAhorro } from '../../../../modelos/metas-ahorro-model';
import { Plantilla } from '../../../../modelos/template.intetrfaces';
import { TranslatePipe } from '../../../../pipes/translate.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderAutenticado, BaseChartDirective, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})

export class Dashboard implements OnInit {

  usuario: any = null;

  metas: MetaAhorro[] = [];
  resumenMensual: ResumenMensualAhorro[] = [];
  plantillas: Plantilla[] = [];

  presupuestoTotal = 0;
  gastadoTotal = 0;
  ahorroPendiente = 0;
  metasActivas = 0;
  metasCompletadas = 0;
  totalMetas = 0;

  ingresosMes = 0;
  gastosMes = 0;
  saldoTotal = 0;
  ahorroMes = 0;

  ultimasMetas: MetaAhorro[] = [];

  public lineChartType: 'line' = 'line';
  public doughnutChartType: 'doughnut' = 'doughnut';

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ahorro mensual',
        fill: true,
        tension: 0.35,
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.12)',
        pointBackgroundColor: '#198754',
        pointBorderColor: '#198754',
        pointRadius: 4
      }
    ]
  };

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#0d6efd',
          '#198754',
          '#7c3aed',
          '#dc3545',
          '#f59e0b',
          '#20c997'
        ],
        borderWidth: 0,
        hoverOffset: 6
      }
    ]
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#374151',
          font: {
            size: 13,
            weight: 600
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.10)'
        }
      },
      y: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.10)'
        }
      }
    }
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: 600
          },
          padding: 18
        }
      }
    },
    cutout: '62%'
  };

  constructor(
    private metasAhorroService: MetasAhorroService,
    private templatesService: TemplatesService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }

    await this.cargarDashboard();
    this.cdr.detectChanges();
  }

  async cargarDashboard(): Promise<void> {
    try {
      const [respuestaMetas, respuestaResumen, respuestaPlantillas] = await Promise.all([
        this.metasAhorroService.obtenerMetas(),
        this.metasAhorroService.obtenerResumenMensual(),
        firstValueFrom(this.templatesService.getMisPlantillas())
      ]);

      this.metas = respuestaMetas?.data?.metas || [];
      this.resumenMensual = respuestaResumen?.data?.resumen || [];
      this.plantillas = respuestaPlantillas?.data || [];
      this.ultimasMetas = [...this.metas].slice(0, 5);

      this.calcularResumenMetas();
      this.calcularResumenPlantillas();
      this.construirGrafica();
      this.construirGraficaAhorros();

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    }
  }

  calcularResumenMetas(): void {
    this.totalMetas = this.metas.length;

    this.presupuestoTotal = this.metas.reduce((total, meta) => {
      return total + Number(meta.objetivo || 0);
    }, 0);

    this.gastadoTotal = this.metas.reduce((total, meta) => {
      return total + Number(meta.actual || 0);
    }, 0);

    this.ahorroPendiente = this.metas.reduce((total, meta) => {
      return total + Math.max(
        Number(meta.objetivo || 0) - Number(meta.actual || 0),
        0
      );
    }, 0);

    this.metasActivas = this.metas.filter(meta =>
      Number(meta.actual || 0) < Number(meta.objetivo || 0)
    ).length;

    this.metasCompletadas = this.metas.filter(meta =>
      Number(meta.actual || 0) >= Number(meta.objetivo || 0)
    ).length;
  }

  calcularResumenPlantillas(): void {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    let ingresosMes = 0;
    let gastosMes = 0;
    let saldoTotal = 0;

    for (const plantilla of this.plantillas) {
      const fecha = plantilla.createdAt ? new Date(plantilla.createdAt) : new Date();
      const esMesActual =
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual;

      for (const block of plantilla.blocks || []) {
        for (const campo of block.campos || []) {
          const importe = Number(campo.importe || 0);

          if (campo.tipo === 'ingreso') {
            saldoTotal += importe;
            if (esMesActual) ingresosMes += importe;
          }

          if (campo.tipo === 'gasto') {
            saldoTotal -= importe;
            if (esMesActual) gastosMes += importe;
          }
        }
      }
    }

    this.saldoTotal = saldoTotal;
    this.ingresosMes = ingresosMes;
    this.gastosMes = gastosMes;
    this.ahorroMes = ingresosMes - gastosMes;
  }

  construirGrafica(): void {
    const ultimosMeses = [...this.resumenMensual].slice(-6);

    this.lineChartData = {
      labels: ultimosMeses.map(item => item.etiqueta || item.mes),
      datasets: [
        {
          data: ultimosMeses.map(item => Number(item.total || 0)),
          label: 'Ahorro mensual',
          fill: true,
          tension: 0.35,
          borderColor: '#198754',
          backgroundColor: 'rgba(25, 135, 84, 0.12)',
          pointBackgroundColor: '#198754',
          pointBorderColor: '#198754',
          pointRadius: 4
        }
      ]
    };
  }

  construirGraficaAhorros(): void {
    this.doughnutChartData = {
      labels: this.ultimasMetas.map(meta => meta.titulo),
      datasets: [
        {
          data: this.ultimasMetas.map(meta =>
            Math.max(Number(meta.objetivo || 0) - Number(meta.actual || 0), 0)
          ),
          backgroundColor: [
            '#0d6efd',
            '#198754',
            '#7c3aed',
            '#dc3545',
            '#f59e0b',
            '#20c997'
          ],
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    };
  }

  calcularProgreso(meta: MetaAhorro): number {
    const objetivo = Number(meta.objetivo || 0);
    const actual = Number(meta.actual || 0);

    if (!objetivo || objetivo <= 0) {
      return 0;
    }

    return Math.max(0, Math.min((actual / objetivo) * 100, 100));
  }
}
