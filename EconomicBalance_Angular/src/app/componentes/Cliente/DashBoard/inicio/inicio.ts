import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TemplatesService } from '../../../../services/templates-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  nombreUsuario: string = '';
  plantillas: any[] = [];
  cargandoPlantillas: boolean = false;
  menuAbierto: boolean = true;

  constructor(
    private router: Router,
    private templateService: TemplatesService
  ) {}

  ngOnInit(): void {
    this.cargarNombreUsuario();

    if (this.sesionIniciada) {
      this.cargarPlantillas();
    }
  }

  get sesionIniciada(): boolean {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    return !!usuario && !!token;
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.nombreUsuario = '';
    this.plantillas = [];
    this.router.navigate(['/']);
  }

  crearPlantilla() {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
      alert('Debes iniciar sesión para crear una plantilla');
      this.router.navigate(['/login']);
      return;
    }

    this.templateService.createBlank().subscribe({
      next: (respuesta) => {
        if (!respuesta.ok) {
          alert(respuesta.mensaje);
          return;
        }

        const plantillaId = (respuesta.data as any)._id || (respuesta.data as any).id;
        this.router.navigate(['/templates', plantillaId]);
      },
      error: (error) => {
        console.error('Error creando plantilla:', error);
        alert('No se pudo crear la plantilla');
      }
    });
  }

  abrirPlantilla(id: string): void {
    this.router.navigate(['/templates', id]);
  }

  private cargarPlantillas(): void {
    this.cargandoPlantillas = true;

    this.templateService.getMisPlantillas().subscribe({
      next: (respuesta) => {
        if (respuesta.ok) {
          this.plantillas = respuesta.data || [];
        } else {
          this.plantillas = [];
        }

        this.cargandoPlantillas = false;
      },
      error: (error) => {
        console.error('Error cargando plantillas:', error);
        this.plantillas = [];
        this.cargandoPlantillas = false;
      }
    });
  }

  private cargarNombreUsuario(): void {
    const usuarioRaw = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuarioRaw || !token || usuarioRaw === 'undefined' || token === 'undefined') {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      this.nombreUsuario = '';
      return;
    }

    try {
      const usuario = JSON.parse(usuarioRaw);
      this.nombreUsuario = usuario?.nombre ?? '';
    } catch {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      this.nombreUsuario = '';
    }
  }
}