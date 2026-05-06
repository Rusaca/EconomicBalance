import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../../../servicios/auth-api.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-noti',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './noti.html',
  styleUrls: ['./noti.css']
})
export class NotiComponent implements OnInit {
  notificaciones: any[] = [];

  constructor(
    private authApi: AuthApiService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarNotificaciones();
  }

  async cargarNotificaciones(): Promise<void> {
    const usuarioGuardado = localStorage.getItem('usuario');
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    const usuarioId = usuario?.id;

    if (!usuarioId) return;

    try {
      const respuesta = await this.authApi.obtenerNotificaciones(usuarioId);
      this.notificaciones = respuesta.data || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  }

  async eliminarNotificacion(id: string): Promise<void> {
    try {
      const respuesta = await this.authApi.eliminarNotificacion(id);

      if (respuesta.ok) {
        this.notificaciones = this.notificaciones.filter(noti => noti._id !== id);
        this.cdr.detectChanges();
      }
    } catch (error) {
      console.error('Error eliminando notificacion:', error);
    }
  }
}
