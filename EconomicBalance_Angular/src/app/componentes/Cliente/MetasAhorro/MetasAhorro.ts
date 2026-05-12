import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  NgClass
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HeaderAutenticado } from '../../Portal/HeaderAutenticado/HeaderAutenticado';

import { MetasAhorroService } from '../../../servicios/metas-ahorro.service';

import {
  CrearMetaAhorroPayload,
  MetaAhorro
} from '../../../modelos/metas-ahorro-model';

interface ResumenMesVisual {
  mes: string;
  total: number;
}

@Component({
  selector: 'app-metas-ahorro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderAutenticado,
    CurrencyPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './MetasAhorro.html',
  styleUrl: './MetasAhorro.css'
})
export class MetasAhorroComponent implements OnInit {

  metas: MetaAhorro[] = [];

  resumenMeses: ResumenMesVisual[] = [];

  mostrarFormulario = false;

  cargandoMetas = false;

  guardandoMeta = false;

  eliminandoMetaId = '';

  mensajeMeta = '';

  errorMeta = '';

  modoEdicion = false;
  metaEditandoId: string | null = null;

  nuevaMetaData: CrearMetaAhorroPayload = {
    titulo: '',
    objetivo: 0,
    actual: 0,
    fechaLimite: ''
  };

  constructor(
    private metasAhorroService: MetasAhorroService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {

    await this.cargarMetas();

    this.generarResumenMensual();

    this.cdr.detectChanges();
  }


  toggleFormulario(meta?: MetaAhorro): void {

    this.mostrarFormulario = !this.mostrarFormulario;

    this.mensajeMeta = '';
    this.errorMeta = '';

    // 👉 SI VIENE UNA META = MODO EDICIÓN
    if (meta) {

      this.modoEdicion = true;
      this.metaEditandoId = meta.id || null;

      this.nuevaMetaData = {
        titulo: meta.titulo,
        objetivo: meta.objetivo,
        actual: meta.actual,
        fechaLimite: meta.fechaLimite
      };

    } else {

      // 👉 SI NO, ES CREAR
      this.modoEdicion = false;
      this.metaEditandoId = null;

      if (!this.mostrarFormulario) {
        this.resetFormulario();
      }
    }
  }

  cancelarFormulario(): void {

    this.mostrarFormulario = false;

    this.resetFormulario();

    this.errorMeta = '';

    this.mensajeMeta = '';
  }

  resetFormulario(): void {

    this.nuevaMetaData = {
      titulo: '',
      objetivo: 0,
      actual: 0,
      fechaLimite: ''
    };
  }
  async editarMeta(): Promise<void> {

    if (!this.metaEditandoId) return;

    this.guardandoMeta = true;
    this.mensajeMeta = '';
    this.errorMeta = '';

    try {

      const respuesta = await this.metasAhorroService.editarMeta(
        this.metaEditandoId,
        this.nuevaMetaData
      );

      if (!respuesta.ok) {
        this.errorMeta = respuesta.mensaje || 'Error al editar la meta.';
        return;
      }

      this.mensajeMeta = 'Meta actualizada correctamente';

      this.mostrarFormulario = false;

      this.modoEdicion = false;

      this.metaEditandoId = null;

      this.resetFormulario();

      await this.cargarMetas();

    } catch (err) {

      console.error(err);

      this.errorMeta = 'Error al editar la meta.';

    } finally {

      this.guardandoMeta = false;
    }
  }

  async guardarMeta(): Promise<void> {

    this.mensajeMeta = '';

    this.errorMeta = '';

    const titulo = this.nuevaMetaData.titulo.trim();

    const objetivo = Number(this.nuevaMetaData.objetivo);

    const actual = Number(this.nuevaMetaData.actual || 0);

    const fechaLimite = this.nuevaMetaData.fechaLimite;

    if (!titulo || objetivo <= 0 || !fechaLimite) {

      this.errorMeta =
        'Completa titulo, objetivo y fecha limite.';

      return;
    }

    if (actual < 0) {

      this.errorMeta =
        'El ahorro actual no puede ser negativo.';

      return;
    }

    if (actual > objetivo) {

      this.errorMeta =
        'El ahorro actual no puede superar el objetivo.';

      return;
    } if (this.modoEdicion) {
      return this.editarMeta();
    }

    this.guardandoMeta = true;

    try {

      const respuesta =
        await this.metasAhorroService.crearMeta({
          titulo,
          objetivo,
          actual,
          fechaLimite
        });

      if (!respuesta.ok) {

        this.errorMeta =
          respuesta.mensaje ||
          'No se pudo guardar la meta.';

        return;
      }

      this.mensajeMeta =
        respuesta.mensaje ||
        'Meta creada correctamente.';

      this.mostrarFormulario = false;

      this.resetFormulario();

      await this.cargarMetas();

      this.generarResumenMensual();

    } catch (error) {

      console.error('Error guardando meta:', error);

      this.errorMeta =
        'Hubo un error al guardar la meta.';

    } finally {

      this.guardandoMeta = false;

      this.cdr.detectChanges();
    }
  }


  async eliminarMeta(meta: MetaAhorro): Promise<void> {

    if (!meta.id) {

      this.errorMeta =
        'La meta no tiene un id valido.';

      return;
    }

    this.mensajeMeta = '';

    this.errorMeta = '';

    this.eliminandoMetaId = meta.id;

    try {

      const respuesta =
        await this.metasAhorroService.eliminarMeta(meta.id);

      if (!respuesta.ok) {

        this.errorMeta =
          respuesta.mensaje ||
          'No se pudo eliminar la meta.';

        return;
      }

      this.metas = this.metas.filter(
        item => item.id !== meta.id
      );

      this.generarResumenMensual();

      this.mensajeMeta =
        respuesta.mensaje ||
        'Meta eliminada correctamente.';

    } catch (error) {

      console.error('Error eliminando meta:', error);

      this.errorMeta =
        'Hubo un error al eliminar la meta.';

    } finally {

      this.eliminandoMetaId = '';

      this.cdr.detectChanges();
    }
  }


  async cargarMetas(): Promise<void> {

    this.cargandoMetas = true;

    this.errorMeta = '';

    try {

      const respuesta =
        await this.metasAhorroService.obtenerMetas();

      if (!respuesta.ok) {

        this.errorMeta =
          respuesta.mensaje ||
          'No se pudieron cargar las metas.';

        this.metas = [];

        return;
      }

      this.metas = respuesta.data?.metas || [];

    } catch (error) {

      console.error('Error cargando metas:', error);

      this.errorMeta =
        'Hubo un error al cargar las metas.';

      this.metas = [];

    } finally {

      this.cargandoMetas = false;

      this.cdr.detectChanges();
    }
  }


  generarResumenMensual(): void {

    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];

    this.resumenMeses = meses.map(mes => ({
      mes,
      total: 0
    }));

    this.metas.forEach(meta => {

      const fecha = new Date(meta.fechaLimite);

      const indiceMes = fecha.getMonth();

      const restante =
        Number(meta.objetivo || 0) -
        Number(meta.actual || 0);

      this.resumenMeses[indiceMes].total +=
        Math.max(restante, 0);
    });
  }


  calcularProgreso(meta: MetaAhorro): number {

    const objetivo = Number(meta.objetivo);

    const actual = Number(meta.actual);

    if (!objetivo || objetivo <= 0) {
      return 0;
    }

    const porcentaje = (actual / objetivo) * 100;

    return Math.max(0, Math.min(porcentaje, 100));
  }

  obtenerTextoProgreso(meta: MetaAhorro): string {

    return `${Math.round(this.calcularProgreso(meta))}%`;
  }

  calcularRestante(meta: MetaAhorro): number {

    return Math.max(
      Number(meta.objetivo) - Number(meta.actual),
      0
    );
  }

  metaCompletada(meta: MetaAhorro): boolean {

    return Number(meta.actual) >= Number(meta.objetivo);
  }

  metaVencida(meta: MetaAhorro): boolean {

    if (!meta.fechaLimite) {
      return false;
    }

    const hoy = new Date();

    const fecha = new Date(meta.fechaLimite);

    hoy.setHours(0, 0, 0, 0);

    fecha.setHours(0, 0, 0, 0);

    return fecha < hoy && !this.metaCompletada(meta);
  }

  obtenerEstadoMeta(meta: MetaAhorro): string {

    if (this.metaCompletada(meta)) {
      return 'Completada';
    }

    if (this.metaVencida(meta)) {
      return 'Vencida';
    }

    return 'En progreso';
  }

  trackByMeta(_: number, meta: MetaAhorro): string {
    return meta.id;
  }
}