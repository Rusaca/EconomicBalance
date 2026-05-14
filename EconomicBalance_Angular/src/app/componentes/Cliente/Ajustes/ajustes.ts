import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '../../../servicios/translate.service';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { AjustesService } from '../../../servicios/ajustes.service';

export interface AjustesUsuario {
  idioma: 'es' | 'en';
  notificacionesEmail: boolean;
  notificacionesApp: boolean;
  modoOscuro: boolean;
  recordatorios: boolean;
  sincronizacion: boolean;
  autoguardado: boolean;
}

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './ajustes.html',
  styleUrl: './ajustes.css',
})
export class AjustesComponent implements OnInit {

  idioma: 'es' | 'en' = 'es';

  notificacionesEmail = true;
  notificacionesApp = true;
  modoOscuro = false;
  recordatorios = true;
  sincronizacion = true;
  autoguardado = true;

  mensaje = '';
  usuario: any = null;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private ajustesService: AjustesService,
    private cdr: ChangeDetectorRef
  ) {
    this.idioma = this.translate.lang();
  }

  async ngOnInit(): Promise<void> {
    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {
      this.usuario = JSON.parse(usuarioGuardado);
    }

    await this.cargarAjustes();
    this.cdr.detectChanges();
  }

  async cargarAjustes(): Promise<void> {
    try {
      const usuarioId = this.usuario?._id || this.usuario?.id;

      if (!usuarioId) {
        return;
      }

      const respuesta = await this.ajustesService.obtenerAjustes(usuarioId);

      if (!respuesta?.ok || !respuesta?.data?.ajustes) {
        return;
      }

      const ajustes = respuesta.data.ajustes;

      this.idioma = ajustes.idioma ?? 'es';
      this.notificacionesEmail = ajustes.notificacionesEmail ?? true;
      this.notificacionesApp = ajustes.notificacionesApp ?? true;
      this.modoOscuro = ajustes.modoOscuro ?? false;
      this.recordatorios = ajustes.recordatorios ?? true;
      this.sincronizacion = ajustes.sincronizacion ?? true;
      this.autoguardado = ajustes.autoguardado ?? true;

      this.translate.setLang(this.idioma);
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando ajustes:', error);
    }
  }

  async guardarAjustes(): Promise<void> {
    try {
      const usuarioId = this.usuario?._id || this.usuario?.id;

      if (!usuarioId) {
        this.mensaje = 'No se encontró el usuario';
        setTimeout(() => this.mensaje = '', 3000);
        return;
      }

      this.translate.setLang(this.idioma);

      const payload: AjustesUsuario = {
        idioma: this.idioma,
        notificacionesEmail: this.notificacionesEmail,
        notificacionesApp: this.notificacionesApp,
        modoOscuro: this.modoOscuro,
        recordatorios: this.recordatorios,
        sincronizacion: this.sincronizacion,
        autoguardado: this.autoguardado
      };

      const respuesta = await this.ajustesService.guardarAjustes(usuarioId, payload);

      if (!respuesta?.ok) {
        this.mensaje = respuesta?.mensaje || 'No se pudieron guardar los ajustes';
        this.cdr.detectChanges();
        setTimeout(() => this.mensaje = '', 3000);
        return;
      }

      this.mensaje = respuesta?.mensaje || 'Ajustes guardados correctamente';
      this.cdr.detectChanges();
      setTimeout(() => this.mensaje = '', 3000);
    } catch (error) {
      console.error('Error guardando ajustes:', error);
      this.mensaje = 'Error al guardar ajustes';
      this.cdr.detectChanges();
      setTimeout(() => this.mensaje = '', 3000);
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}
