import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemplatesService } from '../../../services/templates-service';
import { Plantilla, Bloque, Campo, GraficaPlantilla } from '../../../modelos/template.intetrfaces';

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
  offsetX = 0;
  offsetY = 0;
  bloqueActivo: Bloque | null = null;

  popupCampoVisible = false;
  bloqueSeleccionado: Bloque | null = null;
  campoEditandoId: string | null = null;

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
    private templateService: TemplatesService
  ) {}
ngOnInit(): void {
  if (!localStorage.getItem('token') || !localStorage.getItem('usuario')) {
    this.router.navigate(['/login']);
    return;
  }

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
        blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : [],
        graficas: Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : []
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

    this.popupCampoVisible = true;
  }

 guardarCampo(): void {
  if (!this.bloqueSeleccionado) return;

  const concepto = this.nuevoCampo.concepto.trim();
  const categoria = this.nuevoCampo.categoria;
  const importe = Number(this.nuevoCampo.importe);

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
      campo.tipo = this.nuevoCampo.tipo;
      campo.categoria = categoria;
      campo.concepto = concepto;
      campo.importe = importe;
      campo.movimientos = campo.categoria === 'variable' ? (campo.movimientos || []) : [];
    }
  } else {
    this.bloqueSeleccionado.campos.push({
      id: this.generarId(),
      tipo: this.nuevoCampo.tipo,
      categoria,
      concepto,
      importe,
      movimientos: categoria === 'variable' ? [] : [],
    });
  }

  this.popupCampoVisible = false;
  this.bloqueSeleccionado = null;
  this.campoEditandoId = null;
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

    this.template.graficas = this.template.graficas || [];
    this.template.graficas.push({
      id: this.generarId(),
      bloqueId: bloque.id,
      titulo,
      tipo: this.tipoGrafica,
      createdAt: new Date().toISOString(),
    });

    this.mensajeGuardado = 'Grafica generada correctamente';
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
  }

  startDrag(event: MouseEvent, bloque: Bloque): void {
    const target = event.target as HTMLElement;

    if (
      bloque.fijado ||
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
    this.bloqueActivo = bloque;
    this.offsetX = event.clientX - rect.left;
    this.offsetY = event.clientY - rect.top;

    this.cerrarMenus();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.dragging || !this.bloqueActivo) return;

    this.bloqueActivo.x = event.clientX - this.offsetX;
    this.bloqueActivo.y = event.clientY - this.offsetY;
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.dragging = false;
    this.bloqueActivo = null;
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
        blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : [],
        graficas: Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : []
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
          blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : [],
          graficas: Array.isArray(respuesta.data.graficas) ? respuesta.data.graficas : []
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
}
