import { Component } from '@angular/core';
import { HeaderAutenticado } from '../../../Portal/HeaderAutenticado/HeaderAutenticado';
import { FooterComponent } from '../../../Portal/FooterAutenticado/footer';
import { BaseChartDirective } from 'ng2-charts';
import {
  ChartConfiguration,
  ChartData
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderAutenticado, FooterComponent, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  public lineChartType: 'line' = 'line';

  public lineChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        data: [1200, 1900, 1500, 2300, 2100, 2600, 2450],
        label: 'Ingresos',
        fill: true,
        tension: 0.35,
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.12)',
        pointBackgroundColor: '#198754',
        pointBorderColor: '#198754',
        pointRadius: 4
      },
      {
        data: [900, 1100, 980, 1300, 1200, 1500, 1784],
        label: 'Gastos',
        fill: true,
        tension: 0.35,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.10)',
        pointBackgroundColor: '#dc3545',
        pointBorderColor: '#dc3545',
        pointRadius: 4
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
}
