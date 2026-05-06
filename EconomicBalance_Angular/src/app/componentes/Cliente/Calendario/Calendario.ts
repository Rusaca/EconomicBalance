import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';
import { FooterComponent } from '../../Portal/FooterAutenticado/footer';
import { PresupuestosService } from '../../../servicios/presupuestos.service';

interface EventoCalendario {
  titulo: string;
  descripcion: string;
  tipo: 'ingreso' | 'gasto' | 'total';
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

  constructor(private presupuestosService: PresupuestosService) {}

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

  eventosPorFecha: Record<string, EventoCalendario[]> = {};

  get nombreMesActual(): string {
    return this.meses[this.mesActual];
  }

  ngOnInit(): void {
    // 🔥 SIEMPRE SE VE EL CALENDARIO COMPLETO
    this.generarCalendario();

    // 🔥 LUEGO SE RELLENAN LOS EVENTOS
    this.cargarEventosDesdeBBDD();
  }

  cargarEventosDesdeBBDD(): void {
    const userId = localStorage.getItem('usuarioId');

    if (!userId) {
      console.error("❌ No hay usuarioId en localStorage. No se pueden cargar plantillas.");
      return;
    }

    this.presupuestosService.obtenerPlantillas(userId).subscribe((plantillas) => {
      this.eventosPorFecha = {};

      plantillas.forEach((plantilla: any) => {
        plantilla.blocks.forEach((block: any) => {
          block.campos.forEach((campo: any) => {

            // 🔥 TU BACKEND REAL: movimientos dentro de cada campo
            campo.movimientos.forEach((mov: any) => {

              const fecha = mov.fecha;
              if (!fecha) return;

              if (!this.eventosPorFecha[fecha]) {
                this.eventosPorFecha[fecha] = [];
              }

              this.eventosPorFecha[fecha].push({
                titulo: campo.concepto,
                descripcion: mov.descripcion || '',
                tipo: campo.tipo,
                cantidad: `${campo.tipo === 'gasto' ? '-' : '+'}${mov.importe} €`
              });

            });

          });
        });
      });

      // 🔥 SOLO ACTUALIZAMOS LOS EVENTOS, NO REGENERAMOS EL CALENDARIO
      this.actualizarEventosEnCalendario();
    });
  }

  actualizarEventosEnCalendario(): void {
    this.diasCalendario = this.diasCalendario.map(dia => {
      const clave = this.formatearFecha(dia.fecha);
      return {
        ...dia,
        eventos: this.eventosPorFecha[clave] || []
      };
    });
  }

  generarCalendario(): void {
    this.diasCalendario = [];

    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);

    let inicioSemana = primerDiaMes.getDay();
    inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const diasMesAnterior = new Date(this.anioActual, this.mesActual, 0).getDate();
    const totalDiasMes = ultimoDiaMes.getDate();

    // Mes anterior
    for (let i = inicioSemana - 1; i >= 0; i--) {
      const numero = diasMesAnterior - i;
      const fecha = new Date(this.anioActual, this.mesActual - 1, numero);
      this.diasCalendario.push(this.crearDia(fecha, numero, false));
    }

    // Mes actual
    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      this.diasCalendario.push(this.crearDia(fecha, dia, true));
    }

    // Mes siguiente
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
      eventos: this.eventosPorFecha[clave] || []
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
    this.actualizarEventosEnCalendario();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }
    this.generarCalendario();
    this.actualizarEventosEnCalendario();
  }

  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
