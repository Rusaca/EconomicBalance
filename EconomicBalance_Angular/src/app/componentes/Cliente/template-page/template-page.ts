import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemplatesService } from '../../../services/templates-service';
import { Plantilla, Bloque } from '../../../modelos/template.intetrfaces';

@Component({
  selector: 'app-template-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './template-page.html',
  styleUrl: './template-page.css',
})
export class TemplatePage implements OnInit {

  // ✅ Inicializada desde el inicio (IMPORTANTE)
  template: Plantilla = {
    id: '',
    nombre: '',
    userId: '',
    blocks: []
  };

  esNuevaPlantilla = false;

  menuLienzo = { visible: false, x: 0, y: 0 };
  menuBloque = { visible: false, x: 0, y: 0, bloque: null as Bloque | null };

  dragging = false;
  offsetX = 0;
  offsetY = 0;
  bloqueActivo: Bloque | null = null;

  popupCampoVisible = false;
  bloqueSeleccionado: Bloque | null = null;
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

    this.templateService.getById(id).subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.router.navigate(['/dashboard']);
          return;
        }

        this.template = respuesta.data;

        if (!this.template.blocks) {
          this.template.blocks = [];
        }
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
      bloque: bloque,
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

  abrirPopupCampo(): void {
    if (!this.menuBloque.bloque) return;

    this.bloqueSeleccionado = this.menuBloque.bloque;

    this.nuevoCampo = {
      tipo: 'gasto',
      categoria: '',
      nombre: '',
      cantidad: 0,
    };

    this.popupCampoVisible = true;
    this.cerrarMenus();
  }

  guardarCampo(): void {
    if (!this.bloqueSeleccionado) return;

    this.bloqueSeleccionado.campos.push({
      id: Date.now().toString(),
      tipo: this.nuevoCampo.tipo,
      categoria: this.nuevoCampo.categoria,
      nombre: this.nuevoCampo.nombre,
      cantidad: Number(this.nuevoCampo.cantidad),
    });

    this.popupCampoVisible = false;
    this.bloqueSeleccionado = null;
  }

  cerrarPopupCampo(): void {
    this.popupCampoVisible = false;
    this.bloqueSeleccionado = null;
  }

  startDrag(event: MouseEvent, bloque: Bloque): void {
    if (bloque.fijado) return;

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
    if (this.esNuevaPlantilla) {
      this.nombrePlantillaTemporal = this.template.nombre || '';
      this.popupNombrePlantillaVisible = true;
      return;
    }

    if (!this.template.id) return;

    this.guardando = true;
    this.mensajeGuardado = '';

    this.templateService.updateTemplate(this.template.id, this.template).subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.guardando = false;
          this.mensajeGuardado = respuesta.mensaje || 'Error al guardar la plantilla';
          return;
        }

        this.template = respuesta.data;
        this.guardando = false;
        this.mensajeGuardado = 'Plantilla guardada correctamente';
        this.limpiarMensajeGuardado();
      },
      error: (err) => {
        console.error('Error al guardar plantilla', err);
        this.guardando = false;
        this.mensajeGuardado = 'Error al guardar la plantilla';
      }
    });
  }

  confirmarPrimerGuardado(): void {
    const nombre = this.nombrePlantillaTemporal.trim();

    if (!nombre) {
      this.mensajeGuardado = 'Debes indicar un nombre para guardar la plantilla';
      return;
    }

    this.guardando = true;
    this.mensajeGuardado = '';

    this.templateService.createBlank(nombre).subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          this.guardando = false;
          this.mensajeGuardado = respuesta.mensaje || 'Error creando la plantilla';
          return;
        }

        const plantillaCreada = respuesta.data;

        this.template = {
          ...plantillaCreada,
          blocks: this.template.blocks || []
        };

        this.templateService.updateTemplate(this.template.id, this.template).subscribe({
          next: (actualizacion) => {
            this.guardando = false;

            if (!actualizacion.ok) {
              this.mensajeGuardado = actualizacion.mensaje || 'Error al guardar la plantilla';
              return;
            }

            this.template = actualizacion.data;
            this.esNuevaPlantilla = false;
            this.popupNombrePlantillaVisible = false;
            this.nombrePlantillaTemporal = '';
            this.mensajeGuardado = 'Plantilla guardada correctamente';
            this.limpiarMensajeGuardado();
            this.router.navigate(['/templates', this.template.id]);
          },
          error: (error) => {
            console.error('Error en el primer guardado de la plantilla', error);
            this.guardando = false;
            this.mensajeGuardado = 'La plantilla se creó pero no se pudo guardar su contenido';
          }
        });
      },
      error: (error) => {
        console.error('Error creando plantilla', error);
        this.guardando = false;
        this.mensajeGuardado = 'Error creando la plantilla';
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