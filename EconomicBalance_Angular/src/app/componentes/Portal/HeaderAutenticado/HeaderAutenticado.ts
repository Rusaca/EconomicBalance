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
  fotoUsuario: string | null = null;

  sidebarAbierto = false;
  menuAbierto = false;
  notificacionesAbierto = false;

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    this.nombreUsuario = usuario.nombre || 'Usuario';
    this.fotoUsuario = usuario.fotoPerfil || null;
  }

  toggleSidebar() {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  toggleUserMenu() {
    this.menuAbierto = !this.menuAbierto;
    this.notificacionesAbierto = false;
  }

  toggleNotificaciones() {
    this.notificacionesAbierto = !this.notificacionesAbierto;
    this.menuAbierto = false;
  }
}
