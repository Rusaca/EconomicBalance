import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.css',
})
export class AjustesComponent {
  notificacionesEmail = true;
  notificacionesApp = false;
  modoOscuro = false;
  idioma = 'es';
  perfilPublico = true;
  verActividad = false;

  mensaje = '';

  constructor(private router: Router) {}

  guardarAjustes() {
    this.mensaje = 'Ajustes guardados correctamente.';
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}

