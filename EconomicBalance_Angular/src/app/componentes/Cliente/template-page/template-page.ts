import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemplatesService } from '../../../services/templates-service';
import { Plantilla, Bloque, Campo, GraficaPlantilla } from '../../../modelos/template.intetrfaces';
import { CampoMaestro, CamposMaestrosService } from '../../../services/campos-maestros.service';

type ElementoMovible = {
  x: number;
  y: number;
  width: number;
  height: number;
  fijado?: boolean;
};

@Component({
  selector: 'app-template-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './template-page.html',
  styleUrl: './template-page.css',
})
export class TemplatePage implements OnInit {
    template: Plantilla = {
    id: '',
    nombre: '',
    userId: '',
    blocks: [],
    graficas: []
  };

  esNuevaPlantilla = true;
  private plantillaIdRuta: string | null = null;

  menuLienzo = { visible: false, x: 0, y: 0 };
  menuBloque = { visible: false, x: 0, y: 0, bloque: null as Bloque | null };

  dragging = false;
  resizing = false;
  offsetX = 0;
  offsetY = 0;
  elementoActivo: ElementoMovible | null = null;
  elementoResizeActivo: ElementoMovible | null = null;
  minResizeWidth = 200;
  minResizeHeight = 120;
  resizeStartX = 0;
  resizeStartY = 0;
  resizeStartWidth = 0;
  resizeStartHeight = 0;

  popupCampoVisible = false;
  bloqueSeleccionado: Bloque | null = null;
  campoEditandoId: string | null = null;
  modoCampoManual = false;
  camposMaestros: CampoMaestro[] = [];
  campoMaestroSeleccionadoId = '';
  guardandoCampoMaestro = false;

  nuevoCampoMaestro = {
    nombre: '',
    tipo: 'gasto' as 'ingreso' | 'gasto',
    categoria: 'fijo' as 'fijo' | 'variable'
  };

  popupNombrePlantillaVisible = false;
  nombrePlantillaTemporal = '';

  nuevoCampo = {
    tipo: 'gasto' as 'ingreso' | 'gasto',
    categoria: 'fijo' as 'fijo' | 'variable',
    concepto: '',
    importe: 0,
  };

  popupMovimientoVisible = false;
  campoMovimientoSeleccionado: Campo | null = null;

  nuevoMovimiento = {
    fecha: '',
    descripcion: '',
    importe: 0,
  };

  popupGraficaVisible = false;
  bloqueGraficaId = '';
  tipoGrafica: 'bar' | 'pie' | 'doughnut' | 'line' = 'bar';
  tituloGrafica = '';

  guardando = false;
  mensajeGuardado = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplatesService,
    private camposMaestrosService: CamposMaestrosService
  ) {}
ngOnInit(): void {
  if (!localStorage.getItem('token') || !localStorage.getItem('usuario')) {
    this.router.navigate(['/login']);
    return;
  }

  this.cargarCamposMaestros();

  const id = this.route.snapshot.paramMap.get('id');
  this.plantillaIdRuta = id && id !== 'nueva' ? id : null;

  if (!this.plantillaIdRuta) {
    this.esNuevaPlantilla = true;
    return;
  }

  this.esNuevaPlantilla = false;

  this.templateService.getById(this.plantillaIdRuta).subscribe({
    next: (respuesta) => {
      if (!respuesta.ok) {
        this.router.navigate(['/dashboard']);
        return;
      }

      this.template = {
        ...respuesta.data,
        id: respuesta.data.id || this.plantillaIdRuta || '',
        blocks: this.normalizarBloques(Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []),
        graficas: this.normalizarGraficas(Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : [])
      };
    },
    error: (err) => {
      console.error('Error al cargar plantilla', err);
      this.router.navigate(['/dashboard']);
    }
  });
}


  private generarId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
  }

  abrirMenuLienzo(event: MouseEvent): void {
    event.preventDefault();
    this.menuBloque.visible = false;

    this.menuLienzo = {
      visible: true,
      x: event.offsetX,
      y: event.offsetY,
    };
  }

  abrirMenuBloque(event: MouseEvent, bloque: Bloque): void {
    event.preventDefault();
    event.stopPropagation();

    this.menuLienzo.visible = false;

    this.menuBloque = {
      visible: true,
      x: event.clientX,
      y: event.clientY,
      bloque,
    };
  }

  crearBloque(): void {
    const nuevoBloque: Bloque = {
      id: this.generarId(),
      titulo: 'Nuevo bloque',
      x: this.menuLienzo.x,
      y: this.menuLienzo.y,
      width: 260,
      height: 140,
      fijado: false,
      campos: [],
    };

     this.template.blocks.push(nuevoBloque);
    this.cerrarMenus();
  }

  clonarBloque(bloque: Bloque): void {
    const desplazamiento = 40;

    const bloqueClonado: Bloque = {
      ...bloque,
      id: this.generarId(),
      titulo: `${bloque.titulo} (copia)`,
      x: bloque.x + desplazamiento,
      y: bloque.y + desplazamiento,
      width: bloque.width,
      height: bloque.height,
      fijado: false,
      campos: bloque.campos
        .filter((campo) => campo.tipo !== 'total')
        .map((campo) => ({
          ...campo,
          id: this.generarId(),
          movimientos: (campo.movimientos || []).map((movimiento) => ({
            ...movimiento,
            id: this.generarId()
          }))
        }))
    };

    this.template.blocks.push(bloqueClonado);
    this.mensajeGuardado = 'Bloque clonado correctamente';
    this.cerrarMenus();
    this.limpiarMensajeGuardado();
  }

  calcularTotalBloque(bloque: Bloque): void {
    const total = bloque.campos.reduce((acumulado, campo) => {
      if (campo.tipo === 'total') {
        return acumulado;
      }

      const importe = campo.categoria === 'variable'
        ? Math.abs(this.calcularGastadoCampo(campo))
        : Math.abs(Number(campo.importe) || 0);

      if (campo.tipo === 'gasto') {
        return acumulado - importe;
      }

      if (campo.tipo === 'ingreso') {
        return acumulado + importe;
      }

      return acumulado;
    }, 0);

    const campoTotalExistente = bloque.campos.find(campo => campo.tipo === 'total');

    if (campoTotalExistente) {
      campoTotalExistente.concepto = 'Total';
      campoTotalExistente.categoria = 'resumen';
      campoTotalExistente.importe = total;
    } else {
      bloque.campos.push({
        id: this.generarId(),
        tipo: 'total',
        categoria: 'resumen',
        concepto: 'Total',
        importe: total,
        movimientos: [],
      });
    }

    this.mensajeGuardado = 'Total calculado correctamente';
    this.cerrarMenus();
    this.limpiarMensajeGuardado();
  }

  eliminarBloque(bloqueId: string): void {
    this.template.blocks = this.template.blocks.filter(b => b.id !== bloqueId);
    this.template.graficas = (this.template.graficas || []).filter(grafica => grafica.bloqueId !== bloqueId);
    this.cerrarMenus();
  }

  toggleFijado(bloque: Bloque): void {
    bloque.fijado = !bloque.fijado;
  }

  abrirPopupCampo(bloque?: Bloque): void {
    const bloqueObjetivo = bloque || this.menuBloque.bloque;
    if (!bloqueObjetivo) return;

    this.bloqueSeleccionado = bloqueObjetivo;
    this.campoEditandoId = null;

    this.nuevoCampo = {
      tipo: 'gasto',
      categoria: 'fijo',
      concepto: '',
      importe: 0,
    };
    this.modoCampoManual = this.camposMaestros.length === 0;
    this.campoMaestroSeleccionadoId = this.camposMaestros[0]?._id || '';
    if (!this.modoCampoManual) {
      this.aplicarCampoMaestroSeleccionado();
    }

    this.popupCampoVisible = true;
    this.cerrarMenus();
  }

  editarCampo(bloque: Bloque, campo: Campo): void {
    if (campo.tipo === 'total') {
      this.mensajeGuardado = 'El campo Total se calcula automáticamente';
      this.limpiarMensajeGuardado();
      return;
    }

    this.bloqueSeleccionado = bloque;
    this.campoEditandoId = campo.id;

    this.nuevoCampo = {
      tipo: campo.tipo,
      categoria: campo.categoria === 'resumen' ? 'fijo' : campo.categoria,
      concepto: campo.concepto,
      importe: campo.importe,
    };
    this.campoMaestroSeleccionadoId = '';

    this.popupCampoVisible = true;
  }

 guardarCampo(): void {
  if (!this.bloqueSeleccionado) return;

  const campoMaestroSeleccionado = this.camposMaestros.find(
    (campoMaestro) => campoMaestro._id === this.campoMaestroSeleccionadoId
  );

  const usaMaestroEnNuevoCampo = !this.campoEditandoId && !this.modoCampoManual && !!campoMaestroSeleccionado;
  const tipo = usaMaestroEnNuevoCampo
    ? (campoMaestroSeleccionado?.tipo || this.nuevoCampo.tipo)
    : this.nuevoCampo.tipo;
  const categoria = usaMaestroEnNuevoCampo
    ? (campoMaestroSeleccionado?.categoria || this.nuevoCampo.categoria)
    : this.nuevoCampo.categoria;
  const concepto = usaMaestroEnNuevoCampo
    ? (campoMaestroSeleccionado?.nombre?.trim() || '')
    : this.nuevoCampo.concepto.trim();
  const importe = Number(this.nuevoCampo.importe);

  if (!this.campoEditandoId && !this.modoCampoManual && !campoMaestroSeleccionado) {
    this.mensajeGuardado = 'Selecciona un campo maestro o cambia a modo manual';
    this.limpiarMensajeGuardado();
    return;
  }

  if (!concepto) {
    this.mensajeGuardado = 'El campo debe tener un concepto';
    this.limpiarMensajeGuardado();
    return;
  }

  if (isNaN(importe) || importe < 0) {
    this.mensajeGuardado = 'El importe debe ser positivo o 0';
    this.limpiarMensajeGuardado();
    return;
  }

  if (this.campoEditandoId) {
    const campo = this.bloqueSeleccionado.campos.find(c => c.id === this.campoEditandoId);

    if (campo) {
      campo.tipo = tipo;
      campo.categoria = categoria;
      campo.concepto = concepto;
      campo.importe = importe;
      campo.movimientos = campo.categoria === 'variable' ? (campo.movimientos || []) : [];
    }
  } else {
    this.bloqueSeleccionado.campos.push({
      id: this.generarId(),
      tipo,
      categoria,
      concepto,
      importe,
      movimientos: categoria === 'variable' ? [] : [],
    });
  }

  this.popupCampoVisible = false;
  this.bloqueSeleccionado = null;
  this.campoEditandoId = null;
  this.resetEstadoCampoMaestro();
}


  abrirPopupMovimiento(campo: Campo): void {
    if (campo.categoria !== 'variable' || campo.tipo === 'total') return;

    this.campoMovimientoSeleccionado = campo;
    this.nuevoMovimiento = {
      fecha: new Date().toISOString().slice(0, 10),
      descripcion: '',
      importe: 0,
    };

    this.popupMovimientoVisible = true;
  }

  guardarMovimiento(): void {
    if (!this.campoMovimientoSeleccionado) return;

    const fecha = this.nuevoMovimiento.fecha;
    const descripcion = this.nuevoMovimiento.descripcion.trim();
    const importe = Number(this.nuevoMovimiento.importe);

    if (!fecha) {
      this.mensajeGuardado = 'Debes indicar una fecha';
      this.limpiarMensajeGuardado();
      return;
    }

    if (isNaN(importe) || importe <= 0) {
      this.mensajeGuardado = 'El importe gastado debe ser mayor que 0';
      this.limpiarMensajeGuardado();
      return;
    }

    this.campoMovimientoSeleccionado.movimientos = this.campoMovimientoSeleccionado.movimientos || [];
    this.campoMovimientoSeleccionado.movimientos.push({
      id: this.generarId(),
      fecha,
      descripcion,
      importe,
    });

    this.popupMovimientoVisible = false;
    this.campoMovimientoSeleccionado = null;
  }

  cerrarPopupMovimiento(): void {
    this.popupMovimientoVisible = false;
    this.campoMovimientoSeleccionado = null;
  }

  calcularGastadoCampo(campo: Campo): number {
    return (campo.movimientos || []).reduce((total, movimiento) => {
      return total + (Number(movimiento.importe) || 0);
    }, 0);
  }

  abrirPopupGrafica(): void {
    if (!this.template.blocks.length) {
      this.mensajeGuardado = 'Crea al menos un bloque antes de generar una grafica';
      this.limpiarMensajeGuardado();
      return;
    }

    this.bloqueGraficaId = this.template.blocks[0]?.id || '';
    this.tipoGrafica = 'bar';
    this.tituloGrafica = this.template.blocks[0]?.titulo || '';
    this.popupGraficaVisible = true;
  }

  cerrarPopupGrafica(): void {
    this.popupGraficaVisible = false;
  }

  generarGrafica(): void {
    const bloque = this.template.blocks.find(b => b.id === this.bloqueGraficaId);

    if (!bloque) {
      this.mensajeGuardado = 'Selecciona un bloque para generar la grafica';
      this.limpiarMensajeGuardado();
      return;
    }

    const campos = this.obtenerCamposGraficables(bloque);

    if (campos.length === 0) {
      this.mensajeGuardado = 'El bloque no tiene campos para graficar';
      this.limpiarMensajeGuardado();
      return;
    }

    const titulo = this.tituloGrafica.trim() || bloque.titulo;
    const graficaExistente = (this.template.graficas || []).length;
    const desplazamiento = (graficaExistente % 4) * 24;
    const xInicial = (bloque.x || 40) + 300 + desplazamiento;
    const yInicial = (bloque.y || 40) + desplazamiento;

    this.template.graficas = this.template.graficas || [];
    this.template.graficas.push({
      id: this.generarId(),
      bloqueId: bloque.id,
      titulo,
      tipo: this.tipoGrafica,
      x: xInicial,
      y: yInicial,
      width: 420,
      height: 300,
      fijado: false,
      createdAt: new Date().toISOString(),
    });

    this.mensajeGuardado = 'Grafica generada correctamente';
    this.popupGraficaVisible = false;
    this.limpiarMensajeGuardado();
  }

  eliminarGrafica(graficaId: string): void {
    this.template.graficas = (this.template.graficas || []).filter(grafica => grafica.id !== graficaId);
  }

  generarUrlGrafica(grafica: GraficaPlantilla): string {
    const bloque = this.template.blocks.find(b => b.id === grafica.bloqueId);

    if (!bloque) {
      return '';
    }

    const campos = this.obtenerCamposGraficables(bloque);
    const labels = campos.map(campo => campo.concepto);
    const data = campos.map(campo => this.obtenerImporteGrafica(campo));
    const colores = ['#0d6efd', '#16a34a', '#dc2626', '#f59e0b', '#7c3aed', '#0891b2', '#be123c', '#4b5563'];

    const chartConfig = {
      type: grafica.tipo,
      data: {
        labels,
        datasets: [
          {
            label: grafica.titulo,
            data,
            backgroundColor: colores,
            borderColor: grafica.tipo === 'line' ? '#0d6efd' : '#ffffff',
            borderWidth: 2,
            fill: grafica.tipo !== 'line',
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: grafica.tipo === 'pie' || grafica.tipo === 'doughnut'
          },
          title: {
            display: true,
            text: grafica.titulo
          }
        }
      }
    };

    return `https://quickchart.io/chart?width=650&height=380&version=4&chart=${encodeURIComponent(JSON.stringify(chartConfig))}`;
  }

  private obtenerCamposGraficables(bloque: Bloque): Campo[] {
    return bloque.campos.filter(campo => campo.tipo !== 'total');
  }

  private obtenerImporteGrafica(campo: Campo): number {
    return campo.categoria === 'variable'
      ? this.calcularGastadoCampo(campo)
      : Number(campo.importe) || 0;
  }

  eliminarCampo(bloque: Bloque, campoId: string): void {
    bloque.campos = bloque.campos.filter(campo => campo.id !== campoId);
  }

  cerrarPopupCampo(): void {
    this.popupCampoVisible = false;
    this.bloqueSeleccionado = null;
    this.campoEditandoId = null;
    this.resetEstadoCampoMaestro();
  }

  startDrag(event: MouseEvent, bloque: Bloque): void {
    this.iniciarDrag(event, bloque);
  }

  startDragGrafica(event: MouseEvent, grafica: GraficaPlantilla): void {
    this.iniciarDrag(event, grafica);
  }

  toggleFijadoGrafica(grafica: GraficaPlantilla): void {
    grafica.fijado = !grafica.fijado;
  }

  startResizeBloque(event: MouseEvent, bloque: Bloque): void {
    this.iniciarResize(event, bloque, 220, 120);
  }

  startResizeGrafica(event: MouseEvent, grafica: GraficaPlantilla): void {
    this.iniciarResize(event, grafica, 320, 220);
  }

  private iniciarDrag(event: MouseEvent, elemento: ElementoMovible): void {
    const target = event.target as HTMLElement;

    if (
      this.resizing ||
      elemento.fijado ||
      target.closest('.resize-handle') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('button') ||
      target.closest('textarea')
    ) {
      return;
    }

    event.stopPropagation();

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    this.dragging = true;
    this.elementoActivo = elemento;
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    this.cerrarMenus();
  }

  private iniciarResize(
    event: MouseEvent,
    elemento: ElementoMovible,
    minWidth: number,
    minHeight: number
  ): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragging = false;
    this.elementoActivo = null;
    this.resizing = true;
    this.elementoResizeActivo = elemento;
    this.minResizeWidth = minWidth;
    this.minResizeHeight = minHeight;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartWidth = elemento.width;
    this.resizeStartHeight = elemento.height;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.resizing && this.elementoResizeActivo) {
      const deltaX = event.clientX - this.resizeStartX;
      const deltaY = event.clientY - this.resizeStartY;

      this.elementoResizeActivo.width = Math.max(this.minResizeWidth, this.resizeStartWidth + deltaX);
      this.elementoResizeActivo.height = Math.max(this.minResizeHeight, this.resizeStartHeight + deltaY);
      return;
    }

    if (!this.dragging || !this.elementoActivo) return;

    this.elementoActivo.x = event.clientX - this.offsetX;
    this.elementoActivo.y = event.clientY - this.offsetY;
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.resizing = false;
    this.elementoResizeActivo = null;
    this.dragging = false;
    this.elementoActivo = null;
  }

  @HostListener('document:click')
  cerrarMenus(): void {
    this.menuLienzo.visible = false;
    this.menuBloque.visible = false;
  }

 guardarPlantilla(): void {
  const idPlantilla = this.template.id || this.plantillaIdRuta;
  const nombreActual = this.template.nombre?.trim();

  if (!idPlantilla) {
    this.nombrePlantillaTemporal = nombreActual || '';
    this.popupNombrePlantillaVisible = true;
    return;
  }

  if (!nombreActual) {
    this.mensajeGuardado = 'La plantilla debe tener un nombre';
    this.limpiarMensajeGuardado();
    return;
  }

  this.guardando = true;
  this.mensajeGuardado = '';

  this.templateService.updateTemplate(idPlantilla, {
    ...this.template,
    id: idPlantilla,
    nombre: nombreActual
  }).subscribe({
    next: (respuesta) => {
      this.guardando = false;

      if (!respuesta.ok) {
        this.mensajeGuardado = respuesta.mensaje || 'Error al guardar la plantilla';
        this.limpiarMensajeGuardado();
        return;
      }

      this.template = {
        ...respuesta.data,
        id: respuesta.data.id || idPlantilla,
        blocks: this.normalizarBloques(Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []),
        graficas: this.normalizarGraficas(Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : [])
      };

      this.plantillaIdRuta = this.template.id;
      this.esNuevaPlantilla = false;
      this.mensajeGuardado = 'Plantilla guardada correctamente';
      this.limpiarMensajeGuardado();
    },
    error: (err) => {
      console.error('Error al guardar plantilla', err);
      this.guardando = false;
      this.mensajeGuardado = 'Error al guardar la plantilla';
      this.limpiarMensajeGuardado();
    }
  });
}


  confirmarPrimerGuardado(): void {
    const nombre = this.nombrePlantillaTemporal.trim();

    if (!nombre) {
      this.mensajeGuardado = 'Debes indicar un nombre para guardar la plantilla';
      this.limpiarMensajeGuardado();
      return;
    }

    this.guardando = true;
    this.mensajeGuardado = '';

    this.templateService.createTemplate(nombre, this.template.blocks || [], this.template.graficas || []).subscribe({
      next: (respuesta) => {
        this.guardando = false;

        if (!respuesta.ok) {
          this.mensajeGuardado = respuesta.mensaje || 'Error creando la plantilla';
          this.limpiarMensajeGuardado();
          return;
        }

        const idCreado = respuesta.data.id || (respuesta.data as any)._id || '';

        if (!idCreado) {
          this.mensajeGuardado = 'La plantilla se ha creado, pero no se ha recibido su id';
          this.limpiarMensajeGuardado();
          return;
        }

        this.template = {
          ...respuesta.data,
          id: idCreado,
          nombre,
          blocks: this.normalizarBloques(Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []),
          graficas: this.normalizarGraficas(Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : [])
        };

        this.plantillaIdRuta = idCreado;
        this.esNuevaPlantilla = false;
        this.popupNombrePlantillaVisible = false;
        this.nombrePlantillaTemporal = '';
        this.mensajeGuardado = 'Plantilla guardada correctamente';
        this.limpiarMensajeGuardado();

        this.router.navigate(['/templates', idCreado], { replaceUrl: true });
      },
      error: (error) => {
        console.error('Error creando plantilla', error);
        this.guardando = false;
        this.mensajeGuardado = 'Error creando la plantilla';
        this.limpiarMensajeGuardado();
      }
    });
  }

  cancelarPrimerGuardado(): void {
    this.popupNombrePlantillaVisible = false;
    this.nombrePlantillaTemporal = '';
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  private limpiarMensajeGuardado(): void {
    setTimeout(() => {
      this.mensajeGuardado = '';
    }, 2500);
  }

  cargarCamposMaestros(): void {
    this.camposMaestrosService.getCampos().subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.camposMaestros = [];
          return;
        }

        this.camposMaestros = Array.isArray(respuesta.data) ? respuesta.data : [];

        if (!this.campoMaestroSeleccionadoId && this.camposMaestros.length) {
          this.campoMaestroSeleccionadoId = this.camposMaestros[0]._id;
        }
      },
      error: (error) => {
        console.error('Error cargando campos maestros:', error);
        this.camposMaestros = [];
      }
    });
  }

  aplicarCampoMaestroSeleccionado(): void {
    if (this.modoCampoManual) {
      return;
    }

    const campoMaestroSeleccionado = this.camposMaestros.find(
      (campoMaestro) => campoMaestro._id === this.campoMaestroSeleccionadoId
    );

    if (!campoMaestroSeleccionado) {
      return;
    }

    this.nuevoCampo.tipo = campoMaestroSeleccionado.tipo;
    this.nuevoCampo.categoria = campoMaestroSeleccionado.categoria;
    this.nuevoCampo.concepto = campoMaestroSeleccionado.nombre;
  }

  activarModoManual(): void {
    this.modoCampoManual = true;
  }

  activarModoMaestro(): void {
    if (!this.camposMaestros.length) {
      this.modoCampoManual = true;
      return;
    }

    this.modoCampoManual = false;
    if (!this.campoMaestroSeleccionadoId) {
      this.campoMaestroSeleccionadoId = this.camposMaestros[0]._id;
    }
    this.aplicarCampoMaestroSeleccionado();
  }

  crearCampoMaestroUsuario(): void {
    const nombre = this.nuevoCampoMaestro.nombre.trim();

    if (!nombre) {
      this.mensajeGuardado = 'El nombre del campo maestro es obligatorio';
      this.limpiarMensajeGuardado();
      return;
    }

    this.guardandoCampoMaestro = true;

    this.camposMaestrosService
      .crearCampo({
        nombre,
        tipo: this.nuevoCampoMaestro.tipo,
        categoria: this.nuevoCampoMaestro.categoria
      })
      .subscribe({
        next: (respuesta) => {
          this.guardandoCampoMaestro = false;

          if (!respuesta.ok || !respuesta.data) {
            this.mensajeGuardado = respuesta.mensaje || 'No se pudo crear el campo maestro';
            this.limpiarMensajeGuardado();
            return;
          }

          this.camposMaestros.push(respuesta.data);
          this.camposMaestros.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
          this.campoMaestroSeleccionadoId = respuesta.data._id;
          this.aplicarCampoMaestroSeleccionado();
          this.nuevoCampoMaestro = {
            nombre: '',
            tipo: 'gasto',
            categoria: 'fijo'
          };
          this.mensajeGuardado = 'Campo maestro creado correctamente';
          this.limpiarMensajeGuardado();
        },
        error: (error) => {
          console.error('Error creando campo maestro:', error);
          this.guardandoCampoMaestro = false;
          this.mensajeGuardado = 'Error creando el campo maestro';
          this.limpiarMensajeGuardado();
        }
      });
  }

  eliminarCampoMaestroUsuario(campoMaestro: CampoMaestro): void {
    if (campoMaestro.scope !== 'user') {
      return;
    }

    this.camposMaestrosService.eliminarCampo(campoMaestro._id).subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.mensajeGuardado = respuesta.mensaje || 'No se pudo eliminar el campo maestro';
          this.limpiarMensajeGuardado();
          return;
        }

        this.camposMaestros = this.camposMaestros.filter((item) => item._id !== campoMaestro._id);

        if (this.campoMaestroSeleccionadoId === campoMaestro._id) {
          this.campoMaestroSeleccionadoId = this.camposMaestros[0]?._id || '';
          this.aplicarCampoMaestroSeleccionado();
        }

        this.mensajeGuardado = 'Campo maestro eliminado';
        this.limpiarMensajeGuardado();
      },
      error: (error) => {
        console.error('Error eliminando campo maestro:', error);
        this.mensajeGuardado = 'Error eliminando el campo maestro';
        this.limpiarMensajeGuardado();
      }
    });
  }

  seleccionarCampoMaestro(campoMaestro: CampoMaestro): void {
    this.campoMaestroSeleccionadoId = campoMaestro._id;
    this.aplicarCampoMaestroSeleccionado();
  }

  private resetEstadoCampoMaestro(): void {
    this.modoCampoManual = false;
    this.campoMaestroSeleccionadoId = this.camposMaestros[0]?._id || '';
    this.nuevoCampoMaestro = {
      nombre: '',
      tipo: 'gasto',
      categoria: 'fijo'
    };
  }

  get campoMaestroSeleccionado(): CampoMaestro | null {
    return this.camposMaestros.find(
      (campoMaestro) => campoMaestro._id === this.campoMaestroSeleccionadoId
    ) || null;
  }

  private normalizarGraficas(graficas: GraficaPlantilla[]): GraficaPlantilla[] {
    return graficas.map((grafica, indice) => ({
      ...grafica,
      x: typeof grafica.x === 'number' ? grafica.x : 340 + ((indice % 4) * 24),
      y: typeof grafica.y === 'number' ? grafica.y : 40 + ((indice % 4) * 24),
      width: typeof grafica.width === 'number' ? grafica.width : 420,
      height: typeof grafica.height === 'number' ? grafica.height : 300,
      fijado: typeof grafica.fijado === 'boolean' ? grafica.fijado : false
    }));
  }

  private normalizarBloques(blocks: Bloque[]): Bloque[] {
    return blocks.map((bloque) => ({
      ...bloque,
      width: typeof bloque.width === 'number' ? bloque.width : 260,
      height: typeof bloque.height === 'number' ? bloque.height : 140
    }));
  }
}
