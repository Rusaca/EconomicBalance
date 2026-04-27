import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class HeaderComponent implements OnInit {
  nombreUsuario = '';

  constructor(public router: Router) {}   // 🔥 CAMBIO AQUÍ

  ngOnInit(): void {
    this.cargarNombreUsuario();
  }

  get sesionIniciada(): boolean {
    return !!localStorage.getItem('usuario') && !!localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  private cargarNombreUsuario(): void {
    const usuarioRaw = localStorage.getItem('usuario');

    if (!usuarioRaw || usuarioRaw === 'undefined') {
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
