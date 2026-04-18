import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemplatesService } from '../../../services/templates-service';
import { Plantilla, Bloque, Campo } from '../../../modelos/template.intetrfaces';

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
    blocks: []
  };

  esNuevaPlantilla = true;

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
    categoria: '',
    nombre: '',
    cantidad: 0,
  };

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

    if (!id || id === 'nueva') {
      this.esNuevaPlantilla = true;
      return;
    }

    this.esNuevaPlantilla = false;

    this.templateService.getById(id).subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.template = {
          ...respuesta.data,
          blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []
        };
      },
      error: (err) => {
        console.error('Error al cargar plantilla', err);
        this.router.navigate(['/dashboard']);
      }
    });
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
      id: Date.now().toString(),
      titulo: 'Nuevo bloque',
      x: this.menuLienzo.x,
      y: this.menuLienzo.y,
      fijado: false,
      campos: [],
    };

    this.template.blocks.push(nuevoBloque);
    this.cerrarMenus();
  }

  eliminarBloque(bloqueId: string): void {
    this.template.blocks = this.template.blocks.filter(b => b.id !== bloqueId);
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
      categoria: '',
      nombre: '',
      cantidad: 0,
    };

    this.popupCampoVisible = true;
    this.cerrarMenus();
  }

  editarCampo(bloque: Bloque, campo: Campo): void {
    this.bloqueSeleccionado = bloque;
    this.campoEditandoId = campo.id;

    this.nuevoCampo = {
      tipo: campo.tipo,
      categoria: campo.categoria,
      nombre: campo.nombre,
      cantidad: campo.cantidad,
    };

    this.popupCampoVisible = true;
  }

  guardarCampo(): void {
    if (!this.bloqueSeleccionado) return;

    const nombre = this.nuevoCampo.nombre.trim();
    const categoria = this.nuevoCampo.categoria.trim();

    if (!nombre) {
      this.mensajeGuardado = 'El campo debe tener un nombre';
      this.limpiarMensajeGuardado();
      return;
    }

    if (this.campoEditandoId) {
      const campo = this.bloqueSeleccionado.campos.find(c => c.id === this.campoEditandoId);

      if (campo) {
        campo.tipo = this.nuevoCampo.tipo;
        campo.categoria = categoria;
        campo.nombre = nombre;
        campo.cantidad = Number(this.nuevoCampo.cantidad);
      }
    } else {
      this.bloqueSeleccionado.campos.push({
        id: Date.now().toString(),
        tipo: this.nuevoCampo.tipo,
        categoria,
        nombre,
        cantidad: Number(this.nuevoCampo.cantidad),
      });
    }

    this.popupCampoVisible = false;
    this.bloqueSeleccionado = null;
    this.campoEditandoId = null;
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
    const nombreActual = this.template.nombre?.trim();

    if (!this.template.id) {
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

    this.templateService.updateTemplate(this.template.id, this.template).subscribe({
      next: (respuesta) => {
        this.guardando = false;

        if (!respuesta.ok) {
          this.mensajeGuardado = respuesta.mensaje || 'Error al guardar la plantilla';
          this.limpiarMensajeGuardado();
          return;
        }

        this.template = {
          ...respuesta.data,
          blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []
        };

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

    this.templateService.createTemplate(nombre, this.template.blocks || []).subscribe({
      next: (respuesta) => {
        this.guardando = false;

        if (!respuesta.ok) {
          this.mensajeGuardado = respuesta.mensaje || 'Error creando la plantilla';
          this.limpiarMensajeGuardado();
          return;
        }

        this.template = {
          ...respuesta.data,
          blocks: Array.isArray(respuesta.data.blocks) ? respuesta.data.blocks : []
        };

        this.esNuevaPlantilla = false;
        this.popupNombrePlantillaVisible = false;
        this.nombrePlantillaTemporal = '';
        this.mensajeGuardado = 'Plantilla guardada correctamente';
        this.limpiarMensajeGuardado();

        this.router.navigate(['/templates', this.template.id]);
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