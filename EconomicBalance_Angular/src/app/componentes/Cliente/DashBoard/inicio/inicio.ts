import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TemplatesService } from '../../../../services/templates-service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  constructor(
    private router: Router,
    private templateService: TemplatesService
  ) {}

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
}