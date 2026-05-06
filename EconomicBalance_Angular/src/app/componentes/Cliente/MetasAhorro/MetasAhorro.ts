import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';

interface MetaAhorro {
  id: string;
  titulo: string;
  objetivo: number;
  actual: number;
  fechaLimite: string;
}

@Component({
  selector: 'metasahorro',
  standalone: true,
  imports: [CommonModule, HeaderAutenticado],
  templateUrl: './MetasAhorro.html',
  styleUrls: ['./MetasAhorro.css']
})
export class MetasComponent {

  metas: MetaAhorro[] = [
    {
      id: '1',
      titulo: 'Ahorro para vacaciones',
      objetivo: 1200,
      actual: 450,
      fechaLimite: '2026-08-01'
    },
    {
      id: '2',
      titulo: 'Fondo de emergencia',
      objetivo: 2000,
      actual: 900,
      fechaLimite: '2026-12-31'
    },
    {
      id: '3',
      titulo: 'Comprar un portátil nuevo',
      objetivo: 1500,
      actual: 300,
      fechaLimite: '2026-10-15'
    }
  ];

  calcularProgreso(meta: MetaAhorro): number {
    return Math.min(100, Math.round((meta.actual / meta.objetivo) * 100));
  }
}
