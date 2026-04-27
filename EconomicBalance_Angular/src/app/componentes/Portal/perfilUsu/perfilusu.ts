import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfilusu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfilusu.html',
  styleUrls: ['./perfilusu.css']
})
export class PerfilUsuComponent {

  nombreUsuario: string = '';
  correoUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const usuario = localStorage.getItem('usuario');

    if (usuario) {
      const datos = JSON.parse(usuario);
      this.nombreUsuario = datos.nombre || 'Usuario';
      this.correoUsuario = datos.correo || '';
    }
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
