import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { FooterComponent } from '../../Portal/FooterAutenticado/footer';

interface EventoCalendario {
  titulo: string;
  descripcion: string;
  tipo: 'ingreso' | 'gasto' | 'recordatorio';
  cantidad?: string;
}

interface DiaCalendario {
  numero: number;
  fecha: Date;
  esMesActual: boolean;
  esHoy: boolean;
  eventos: EventoCalendario[];
}

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, HeaderAutenticado, FooterComponent],
  templateUrl: './Calendario.html',
  styleUrl: './Calendario.css'
})
export class CalendarioComponent implements OnInit {
  diasSemana: string[] = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];

  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  fechaActual = new Date();
  mesActual = this.fechaActual.getMonth();
  anioActual = this.fechaActual.getFullYear();

  diasCalendario: DiaCalendario[] = [];
  diaSeleccionado: DiaCalendario | null = null;

  eventosEjemplo: Record<string, EventoCalendario[]> = {
    '2026-05-03': [
      {
        titulo: 'Nomina',
        descripcion: 'Ingreso mensual recibido',
        tipo: 'ingreso',
        cantidad: '+1.850 €'
      }
    ],
    '2026-05-06': [
      {
        titulo: 'Supermercado',
        descripcion: 'Compra semanal',
        tipo: 'gasto',
        cantidad: '-64 €'
      }
    ],
    '2026-05-10': [
      {
        titulo: 'Alquiler',
        descripcion: 'Pago mensual de vivienda',
        tipo: 'gasto',
        cantidad: '-720 €'
      }
    ],
    '2026-05-14': [
      {
        titulo: 'Recordatorio luz',
        descripcion: 'Revisar factura de electricidad',
        tipo: 'recordatorio'
      }
    ],
    '2026-05-18': [
      {
        titulo: 'Ocio',
        descripcion: 'Cena y actividades',
        tipo: 'gasto',
        cantidad: '-48 €'
      },
      {
        titulo: 'Transporte',
        descripcion: 'Recarga de abono',
        tipo: 'gasto',
        cantidad: '-20 €'
      }
    ],
    '2026-05-22': [
      {
        titulo: 'Ingreso extra',
        descripcion: 'Trabajo freelance',
        tipo: 'ingreso',
        cantidad: '+260 €'
      }
    ]
  };

  get nombreMesActual(): string {
    return this.meses[this.mesActual];
  }

  ngOnInit(): void {
    this.generarCalendario();
  }

  generarCalendario(): void {
    this.diasCalendario = [];

    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);

    let inicioSemana = primerDiaMes.getDay();
    inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const diasMesAnterior = new Date(this.anioActual, this.mesActual, 0).getDate();
    const totalDiasMes = ultimoDiaMes.getDate();

    for (let i = inicioSemana - 1; i >= 0; i--) {
      const numero = diasMesAnterior - i;
      const fecha = new Date(this.anioActual, this.mesActual - 1, numero);
      this.diasCalendario.push(this.crearDia(fecha, numero, false));
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      this.diasCalendario.push(this.crearDia(fecha, dia, true));
    }

    const restantes = 42 - this.diasCalendario.length;
    for (let dia = 1; dia <= restantes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual + 1, dia);
      this.diasCalendario.push(this.crearDia(fecha, dia, false));
    }

    this.diaSeleccionado = this.diasCalendario.find(d => d.esHoy && d.esMesActual) || null;
  }

  crearDia(fecha: Date, numero: number, esMesActual: boolean): DiaCalendario {
    const hoy = new Date();
    const clave = this.formatearFecha(fecha);

    return {
      numero,
      fecha,
      esMesActual,
      esHoy:
        fecha.getDate() === hoy.getDate() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getFullYear() === hoy.getFullYear(),
      eventos: this.eventosEjemplo[clave] || []
    };
  }

  seleccionarDia(dia: DiaCalendario): void {
    this.diaSeleccionado = dia;
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }

    this.generarCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }

    this.generarCalendario();
  }

  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}

