import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../Sidebar/sidebar';
import { PerfilUsuComponent } from '../perfilUsu/perfilusu';
import { NotiComponent } from '../notificacion/noti';

@Component({
  selector: 'app-header-autenticado',
  standalone: true,
  imports: [CommonModule, RouterLink, SidebarComponent, PerfilUsuComponent, NotiComponent],
  templateUrl: './HeaderAutenticado.html',
  styleUrl: './HeaderAutenticado.css',
})
export class HeaderAutenticado implements OnInit {
  nombreUsuario = '';
  sidebarAbierto = false;
  menuAbierto = false;
  notificacionesAbierto = false;

  ngOnInit(): void {
    this.cargarNombreUsuario();
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  toggleUserMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleNotificaciones() {
    this.notificacionesAbierto = !this.notificacionesAbierto;
    this.menuAbierto = false; 
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
