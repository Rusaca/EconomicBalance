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

  constructor(
    private router: Router,
    private templateService: TemplatesService
  ) {}

  ngOnInit(): void {
    this.cargarNombreUsuario();
  }

  get sesionIniciada(): boolean {
    return this.nombreUsuario.trim().length > 0;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    this.nombreUsuario = '';
    this.router.navigate(['/']);
  }

  crearPlantilla() {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) {
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

        this.router.navigate(['/templates', respuesta.data.id]);
      },
      error: (error) => {
        console.error('Error creando plantilla:', error);
        alert('No se pudo crear la plantilla');
      }
    });
  }

  private cargarNombreUsuario(): void {
    const usuarioRaw = localStorage.getItem('usuario');

    if (!usuarioRaw) {
      this.nombreUsuario = '';
      return;
    }

    try {
      const usuario = JSON.parse(usuarioRaw);
      this.nombreUsuario = usuario?.nombre ?? '';
    } catch {
      this.nombreUsuario = '';
    }
  }
}