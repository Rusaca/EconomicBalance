import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  esSeleccionado: boolean;
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
  constructor(
    private presupuestosService: PresupuestosService,
    private cdr: ChangeDetectorRef
  ) {}

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
    this.generarCalendario();
    this.cargarEventosDesdeBBDD();
  }

  cargarEventosDesdeBBDD(): void {
    this.presupuestosService.obtenerPlantillas().subscribe({
      next: (respuesta: any) => {
        const plantillas = respuesta?.data || [];
        this.eventosPorFecha = {};

        plantillas.forEach((plantilla: any) => {
          const fechaFallback = plantilla.createdAt;

          plantilla.blocks?.forEach((block: any) => {
            block.campos?.forEach((campo: any) => {
              if (Array.isArray(campo.movimientos) && campo.movimientos.length > 0) {
                campo.movimientos.forEach((mov: any) => {
                  this.agregarEvento(
                    mov.fecha || fechaFallback,
                    campo.concepto,
                    mov.descripcion || '',
                    campo.tipo,
                    mov.importe ?? campo.importe
                  );
                });
              } else {
                this.agregarEvento(
                  fechaFallback,
                  campo.concepto,
                  '',
                  campo.tipo,
                  campo.importe
                );
              }
            });
          });
        });

        this.generarCalendario();
        this.seleccionarDiaInicial();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando eventos del calendario:', error);
      }
    });
  }

  agregarEvento(
    fechaValor: string,
    titulo: string,
    descripcion: string,
    tipo: 'ingreso' | 'gasto' | 'total',
    importe: number
  ): void {
    if (!fechaValor) return;

    const fecha = new Date(fechaValor);
    if (isNaN(fecha.getTime())) return;

    const clave = this.formatearFecha(fecha);

    if (!this.eventosPorFecha[clave]) {
      this.eventosPorFecha[clave] = [];
    }

    this.eventosPorFecha[clave].push({
      titulo: titulo || 'Sin concepto',
      descripcion: descripcion || '',
      tipo,
      cantidad: `${tipo === 'gasto' ? '-' : '+'}${importe ?? 0} €`
    });
  }

  seleccionarDiaInicial(): void {
    this.diaSeleccionado =
      this.diasCalendario.find((dia) => dia.esHoy && dia.esMesActual) ||
      this.diasCalendario.find((dia) => dia.esMesActual && dia.eventos.length > 0) ||
      this.diasCalendario.find((dia) => dia.esMesActual) ||
      null;

    this.marcarDiaSeleccionado();
  }

  marcarDiaSeleccionado(): void {
    const claveSeleccionada = this.diaSeleccionado
      ? this.formatearFecha(this.diaSeleccionado.fecha)
      : null;

    this.diasCalendario = this.diasCalendario.map((dia) => ({
      ...dia,
      esSeleccionado: claveSeleccionada === this.formatearFecha(dia.fecha)
    }));

    if (claveSeleccionada) {
      this.diaSeleccionado =
        this.diasCalendario.find((dia) => this.formatearFecha(dia.fecha) === claveSeleccionada) || null;
    }
  }

  generarCalendario(): void {
    const dias: DiaCalendario[] = [];

    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);

    let inicioSemana = primerDiaMes.getDay();
    inicioSemana = inicioSemana === 0 ? 6 : inicioSemana - 1;

    const diasMesAnterior = new Date(this.anioActual, this.mesActual, 0).getDate();
    const totalDiasMes = ultimoDiaMes.getDate();

    for (let i = inicioSemana - 1; i >= 0; i--) {
      const numero = diasMesAnterior - i;
      const fecha = new Date(this.anioActual, this.mesActual - 1, numero);
      dias.push(this.crearDia(fecha, numero, false));
    }

    for (let dia = 1; dia <= totalDiasMes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual, dia);
      dias.push(this.crearDia(fecha, dia, true));
    }

    const restantes = 42 - dias.length;
    for (let dia = 1; dia <= restantes; dia++) {
      const fecha = new Date(this.anioActual, this.mesActual + 1, dia);
      dias.push(this.crearDia(fecha, dia, false));
    }

    this.diasCalendario = dias;
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
      esSeleccionado: false,
      eventos: this.eventosPorFecha[clave] || []
    };
  }

  seleccionarDia(dia: DiaCalendario): void {
    this.diaSeleccionado = dia;
    this.marcarDiaSeleccionado();
  }

  mesAnterior(): void {
    if (this.mesActual === 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else {
      this.mesActual--;
    }

    this.generarCalendario();
    this.seleccionarDiaInicial();
  }

  mesSiguiente(): void {
    if (this.mesActual === 11) {
      this.mesActual = 0;
      this.anioActual++;
    } else {
      this.mesActual++;
    }

    this.generarCalendario();
    this.seleccionarDiaInicial();
  }

  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }
}
